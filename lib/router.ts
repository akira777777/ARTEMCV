import { useEffect, useRef, useCallback, useState, useMemo } from 'react';

/**
 * Enhanced Router Management Utilities
 * 
 * Advanced routing with lazy loading, performance optimization,
 * accessibility, and SEO features.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any> | (() => Promise<{ default: React.ComponentType<any> }>);
  exact?: boolean;
  title?: string;
  description?: string;
  keywords?: string[];
  preload?: boolean;
  authRequired?: boolean;
  roles?: string[];
  meta?: Record<string, string>;
  breadcrumbs?: Array<{ label: string; path?: string }>;
}

export interface RouterState {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  history: string[];
  isLoading: boolean;
  error: string | null;
}

export interface NavigationOptions {
  replace?: boolean;
  state?: any;
  title?: string;
  description?: string;
  scrollRestoration?: boolean;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Enhanced router hook with lazy loading and performance optimization
 */
export function useRouter(routes: RouteConfig[] = []) {
  const [state, setState] = useState<RouterState>({
    path: window.location.pathname,
    params: {},
    query: {},
    history: [window.location.pathname],
    isLoading: false,
    error: null
  });

  const [loadedComponents, setLoadedComponents] = useState<Record<string, React.ComponentType<any>>>({});
  const [preloadedComponents, setPreloadedComponents] = useState<Set<string>>(new Set());
  const mountedRef = useRef(true);

  // Parse URL parameters and query string
  const parseUrl = useCallback((url: string) => {
    const urlObj = new URL(url, window.location.origin);
    const path = urlObj.pathname;
    const query: Record<string, string> = {};

    urlObj.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    return { path, query };
  }, []);

  // Match route and extract parameters
  const matchRoute = useCallback((path: string) => {
    for (const route of routes) {
      const regex = pathToRegex(route.path, route.exact);
      const match = path.match(regex);
      
      if (match) {
        const params = extractParams(route.path, match);
        return { route, params };
      }
    }
    return null;
  }, [routes]);

  // Navigate to a new route
  const navigate = useCallback(async (to: string, options: NavigationOptions = {}) => {
    const { replace = false, state, title, description, scrollRestoration = true } = options;
    const { path, query } = parseUrl(to);

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const match = matchRoute(path);
      if (!match) {
        throw new Error(`No route found for ${path}`);
      }

      const { route, params } = match;

      // Check authentication and roles
      if (route.authRequired) {
        // This would integrate with your auth system
        const isAuthenticated = checkAuth();
        if (!isAuthenticated) {
          navigate('/login', { replace: true });
          return;
        }

        if (route.roles && !hasRoles(route.roles)) {
          navigate('/unauthorized', { replace: true });
          return;
        }
      }

      // Load component if not already loaded
      let Component = loadedComponents[path];
      if (!Component) {
        Component = await loadComponent(route);
        if (!mountedRef.current) return; // Component was unmounted during loading

        setLoadedComponents(prev => ({
          ...prev,
          [path]: Component
        }));
      }

      // Update browser history
      const newUrl = buildUrl(path, query);
      if (replace) {
        window.history.replaceState({ path, query, state }, title || '', newUrl);
      } else {
        window.history.pushState({ path, query, state }, title || '', newUrl);
      }

      // Update document metadata
      if (title) document.title = title;
      if (description) updateMetaTags(route, description);

      // Scroll restoration
      if (scrollRestoration) {
        window.scrollTo(0, 0);
      }

      // Update state
      setState(prev => ({
        path,
        params,
        query,
        history: [...prev.history, path],
        isLoading: false,
        error: null
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Navigation failed'
      }));
    }
  }, [loadedComponents, matchRoute, parseUrl]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state) {
        navigate(buildUrl(state.path, state.query), { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  // Preload components for better performance
  const preloadComponent = useCallback(async (path: string) => {
    if (preloadedComponents.has(path)) return;

    const match = matchRoute(path);
    if (!match) return;

    const { route } = match;
    try {
      const Component = await loadComponent(route);
      setPreloadedComponents(prev => new Set([...prev, path]));
    } catch (error) {
      console.warn(`Failed to preload component for ${path}:`, error);
    }
  }, [matchRoute, preloadedComponents]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    navigate,
    preloadComponent,
    loadedComponents,
    preloadedComponents
  };
}

/**
 * Route guard hook for authentication and permissions
 */
export function useRouteGuard(config: {
  authRequired?: boolean;
  roles?: string[];
  redirectPath?: string;
  unauthorizedPath?: string;
}) {
  const { authRequired = false, roles = [], redirectPath = '/login', unauthorizedPath = '/unauthorized' } = config;
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      setIsLoading(true);

      try {
        if (authRequired) {
          const isAuthenticated = await checkAuth();
          if (!isAuthenticated) {
            window.location.href = redirectPath;
            return;
          }

          if (roles.length > 0) {
            const userRoles = await getUserRoles();
            const hasRequiredRoles = roles.some(role => userRoles.includes(role));
            if (!hasRequiredRoles) {
              window.location.href = unauthorizedPath;
              return;
            }
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Authorization check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [authRequired, roles, redirectPath, unauthorizedPath]);

  return { isAuthorized, isLoading };
}

/**
 * Breadcrumb hook for navigation context
 */
export function useBreadcrumbs(routes: RouteConfig[], currentPath: string) {
  const breadcrumbs = useMemo(() => {
    const pathSegments = currentPath.split('/').filter(Boolean);
    const result: Array<{ label: string; path: string }> = [];

    let currentPath = '';
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      const route = routes.find(r => r.path === currentPath);
      if (route) {
        result.push({
          label: route.breadcrumbs?.[0]?.label || segment,
          path: currentPath
        });
      }
    }

    return result;
  }, [routes, currentPath]);

  return breadcrumbs;
}

/**
 * Query parameters hook with type safety
 */
export function useQueryParams<T extends Record<string, string> = Record<string, string>>() {
  const [params, setParams] = useState<T>({} as T);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newParams = {} as T;

    urlParams.forEach((value, key) => {
      newParams[key as keyof T] = value as T[keyof T];
    });

    setParams(newParams);
  }, []);

  const updateParams = useCallback((newParams: Partial<T>, options: NavigationOptions = {}) => {
    const url = new URL(window.location.href);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, String(value));
      }
    });

    window.history.pushState({}, '', url.toString());
    setParams(prev => ({ ...prev, ...newParams } as T));
  }, []);

  return { params, updateParams };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Router utilities for common tasks
 */
export const routerUtils = {
  /**
   * Convert path to regex for matching
   */
  pathToRegex: (path: string, exact: boolean = false) => {
    const escapedPath = path
      .replace(/:[^\s/]+/g, '([^/]+)')
      .replace(/\*/g, '(.*)');
    
    const regex = new RegExp(`^${escapedPath}${exact ? '$' : ''}`);
    return regex;
  },

  /**
   * Extract parameters from URL match
   */
  extractParams: (path: string, match: RegExpMatchArray) => {
    const params: Record<string, string> = {};
    const paramNames = path.match(/:([a-zA-Z]+)/g) || [];
    
    paramNames.forEach((param, index) => {
      const paramName = param.slice(1);
      params[paramName] = match[index + 1];
    });

    return params;
  },

  /**
   * Build URL from path and query parameters
   */
  buildUrl: (path: string, query: Record<string, string>) => {
    const url = new URL(path, window.location.origin);
    Object.entries(query).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
    return url.pathname + url.search;
  },

  /**
   * Update meta tags for SEO
   */
  updateMetaTags: (route: RouteConfig, description?: string) => {
    // Update title
    if (route.title) {
      document.title = route.title;
    }

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || route.description || '');

    // Update meta keywords
    if (route.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', route.keywords.join(', '));
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', route.title || document.title);
    document.head.appendChild(ogTitle);

    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', description || route.description || '');
    document.head.appendChild(ogDescription);
  },

  /**
   * Create accessible link component
   */
  createAccessibleLink: (Component: React.ComponentType<any>) => {
    return function AccessibleLink(props: any) {
      const { href, children, ...rest } = props;

      return React.createElement(Component, {
        ...rest,
        href,
        'aria-current': window.location.pathname === href ? 'page' : undefined,
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          window.history.pushState({}, '', href);
        }
      }, children);
    };
  },

  /**
   * Scroll to top on route change
   */
  scrollToTop: () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /**
   * Check if path is external
   */
  isExternalPath: (path: string) => {
    return /^(https?:)?\/\//.test(path) || path.startsWith('mailto:') || path.startsWith('tel:');
  }
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Authentication helpers (would integrate with your auth system)
 */
async function checkAuth(): Promise<boolean> {
  // This would check your authentication state
  // For example, checking localStorage, cookies, or calling an API
  return !!localStorage.getItem('authToken');
}

async function getUserRoles(): Promise<string[]> {
  // This would fetch user roles from your auth system
  return JSON.parse(localStorage.getItem('userRoles') || '[]');
}

function hasRoles(requiredRoles: string[]): boolean {
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  return requiredRoles.some(role => userRoles.includes(role));
}

/**
 * Component loading helper with error boundaries
 */
async function loadComponent(route: RouteConfig): Promise<React.ComponentType<any>> {
  if (typeof route.component === 'function' && route.component.constructor.name === 'AsyncFunction') {
    try {
      const module = await (route.component as () => Promise<{ default: React.ComponentType<any> }>());
      return module.default;
    } catch (error) {
      console.error(`Failed to load component for route ${route.path}:`, error);
      throw error;
    }
  }
  return route.component as React.ComponentType<any>;
}

export default {
  useRouter,
  useRouteGuard,
  useBreadcrumbs,
  useQueryParams,
  routerUtils
};