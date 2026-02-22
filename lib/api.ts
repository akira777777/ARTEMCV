import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Enhanced API Management Utilities
 * 
 * Advanced API handling with caching, error handling, retry logic,
 * authentication, and performance optimization.
 *
 * SECURITY NOTICE:
 * This module has been updated to use cookie-based authentication for
 * improved security. For maximum protection against XSS (Cross-Site Scripting),
 * it is strongly recommended that the authentication token ('authToken')
 * is set by the server using the 'HttpOnly' flag.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTime?: number;
  auth?: boolean;
  authHeader?: string;
  authPrefix?: string;
  headers?: Record<string, string>;
  interceptors?: {
    request?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
    response?: (response: Response) => Response | Promise<Response>;
    error?: (error: any) => any;
  };
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTime?: number;
  auth?: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig;
  request?: any;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  config?: RequestConfig;
  response?: Response;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Enhanced API hook with caching and error handling
 */
export function useApi(config: ApiConfig = {}) {
  const {
    baseURL = '',
    timeout = 10000,
    retries = 3,
    retryDelay = 1000,
    cache = false,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    auth = false,
    authHeader = 'Authorization',
    authPrefix = 'Bearer',
    headers = {},
    interceptors = {}
  } = config;

  const cacheRef = useRef<Map<string, { data: any; timestamp: number }>>(new Map());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const generateCacheKey = useCallback((config: RequestConfig) => {
    const url = new URL(config.url, baseURL);
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return `${config.method || 'GET'}:${url.toString()}:${JSON.stringify(config.data || {})}`;
  }, [baseURL]);

  const getCachedData = useCallback((key: string) => {
    if (!cache) return null;

    const cached = cacheRef.current.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cacheTime;
    if (isExpired) {
      cacheRef.current.delete(key);
      return null;
    }

    return cached.data;
  }, [cache, cacheTime]);

  const setCachedData = useCallback((key: string, data: any) => {
    if (!cache) return;

    cacheRef.current.set(key, {
      data,
      timestamp: Date.now()
    });
  }, [cache]);

  const abortRequest = useCallback((key: string) => {
    const controller = abortControllersRef.current.get(key);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(key);
    }
  }, []);

  const request = useCallback(async <T = any>(requestConfig: RequestConfig): Promise<ApiResponse<T>> => {
    const cacheKey = generateCacheKey(requestConfig);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      return {
        data: cachedData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: requestConfig
      };
    }

    // Abort previous request with same key
    abortRequest(cacheKey);

    // Create new abort controller
    const abortController = new AbortController();
    abortControllersRef.current.set(cacheKey, abortController);

    const config: RequestConfig = {
      ...requestConfig,
      timeout: requestConfig.timeout || timeout,
      retries: requestConfig.retries !== undefined ? requestConfig.retries : retries,
      retryDelay: requestConfig.retryDelay || retryDelay,
      cache: requestConfig.cache !== undefined ? requestConfig.cache : cache,
      cacheTime: requestConfig.cacheTime || cacheTime,
      auth: requestConfig.auth !== undefined ? requestConfig.auth : auth
    };

    // Apply request interceptor
    let processedConfig = config;
    if (interceptors.request) {
      processedConfig = await interceptors.request(config);
    }

    // Build URL
    const url = new URL(processedConfig.url, baseURL);
    if (processedConfig.params) {
      Object.entries(processedConfig.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    // Build headers
    const requestHeaders: Record<string, string> = {
      ...headers,
      ...processedConfig.headers
    };

    // Add authentication header
    if (processedConfig.auth) {
      const token = getAuthToken();
      if (token) {
        requestHeaders[authHeader] = `${authPrefix} ${token}`;
      }
    }

    // Add content type for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(processedConfig.method || 'GET')) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    const fetchConfig: RequestInit = {
      method: processedConfig.method || 'GET',
      headers: requestHeaders,
      signal: abortController.signal,
      // Include cookies in cross-origin requests if needed,
      // and always include for same-origin requests.
      credentials: processedConfig.auth ? 'include' : 'same-origin'
    };

    // Add body for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(processedConfig.method || 'GET') && processedConfig.data) {
      fetchConfig.body = JSON.stringify(processedConfig.data);
    }

    // Add timeout
    if (processedConfig.timeout) {
      setTimeout(() => abortController.abort(), processedConfig.timeout);
    }

    let lastError: any;

    for (let attempt = 0; attempt <= (processedConfig.retries || 0); attempt++) {
      try {
        const response = await fetch(url.toString(), fetchConfig);

        // Apply response interceptor
        let processedResponse = response;
        if (interceptors.response) {
          processedResponse = await interceptors.response(response);
        }

        let data: T;
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text() as unknown as T;
        }

        const apiResponse: ApiResponse<T> = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          config: processedConfig,
          request: response
        };

        // Cache successful responses
        if (response.ok && processedConfig.cache) {
          setCachedData(cacheKey, data);
        }

        // Remove abort controller on success
        abortControllersRef.current.delete(cacheKey);

        return apiResponse;

      } catch (error) {
        lastError = error;

        // Don't retry on abort or network errors
        if (error.name === 'AbortError' || !navigator.onLine) {
          break;
        }

        // Don't retry on 4xx errors (except 408, 429)
        if (attempt > 0 && error.status >= 400 && error.status < 500 && ![408, 429].includes(error.status)) {
          break;
        }

        // Wait before retrying
        if (attempt < (processedConfig.retries || 0)) {
          await new Promise(resolve => setTimeout(resolve, processedConfig.retryDelay || retryDelay));
        }
      }
    }

    // Apply error interceptor
    if (interceptors.error) {
      lastError = await interceptors.error(lastError);
    }

    throw lastError;
  }, [baseURL, timeout, retries, retryDelay, cache, cacheTime, auth, authHeader, authPrefix, headers, interceptors, generateCacheKey, getCachedData, abortRequest, setCachedData]);

  const get = useCallback(<T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>) => {
    return request<T>({ ...config, url, method: 'GET' });
  }, [request]);

  const post = useCallback(<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>) => {
    return request<T>({ ...config, url, method: 'POST', data });
  }, [request]);

  const put = useCallback(<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>) => {
    return request<T>({ ...config, url, method: 'PUT', data });
  }, [request]);

  const patch = useCallback(<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>) => {
    return request<T>({ ...config, url, method: 'PATCH', data });
  }, [request]);

  const del = useCallback(<T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>) => {
    return request<T>({ ...config, url, method: 'DELETE' });
  }, [request]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const invalidateCache = useCallback((pattern?: string) => {
    if (!pattern) {
      clearCache();
      return;
    }

    const keysToDelete: string[] = [];
    cacheRef.current.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => cacheRef.current.delete(key));
  }, []);

  return {
    request,
    get,
    post,
    put,
    patch,
    del,
    clearCache,
    invalidateCache,
    abortRequest
  };
}

/**
 * API data fetching hook with loading states
 */
export function useApiData<T = any>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: { immediate?: boolean; dependencies?: any[] } = {}
) {
  const { immediate = true, dependencies = [] } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      if (mountedRef.current) {
        setData(response.data);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err as ApiError);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiCall]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    return () => {
      mountedRef.current = false;
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    reset
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * API utilities for common tasks
 */
export const apiUtils = {
  /**
   * Create API error from response
   */
  createApiError: (response: Response, config?: RequestConfig): ApiError => {
    return {
      message: response.statusText || 'API request failed',
      status: response.status,
      code: response.status.toString(),
      config,
      response
    };
  },

  /**
   * Check if error is a network error
   */
  isNetworkError: (error: any): boolean => {
    return !error.response && error.message.includes('fetch');
  },

  /**
   * Check if error is a timeout error
   */
  isTimeoutError: (error: any): boolean => {
    return error.name === 'AbortError' || error.message.includes('timeout');
  },

  /**
   * Check if error is an authentication error
   */
  isAuthError: (error: any): boolean => {
    return error.status === 401 || error.status === 403;
  },

  /**
   * Retry failed request with exponential backoff
   */
  retryWithBackoff: async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: any;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (i === maxRetries) {
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  },

  /**
   * Debounce API requests
   */
  debounceApi: <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    delay: number
  ): T => {
    let timeoutId: NodeJS.Timeout;

    return ((...args: Parameters<T>) => {
      return new Promise((resolve, reject) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    }) as T;
  },

  /**
   * Throttle API requests
   */
  throttleApi: <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    limit: number
  ): T => {
    let lastCall = 0;
    let lastResult: any;
    let lastArgs: any[] = [];

    return ((...args: Parameters<T>) => {
      return new Promise((resolve, reject) => {
        const now = Date.now();

        if (now - lastCall < limit && JSON.stringify(args) === JSON.stringify(lastArgs)) {
          resolve(lastResult);
          return;
        }

        lastCall = now;
        lastArgs = args;

        fn(...args)
          .then(result => {
            lastResult = result;
            resolve(result);
          })
          .catch(reject);
      });
    }) as T;
  }
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Authentication helpers
 *
 * SECURITY NOTE: While these helpers use document.cookie for storage,
 * for maximum security against XSS, the 'authToken' cookie should be
 * issued by the server with the 'HttpOnly' flag. This prevents
 * client-side scripts from accessing the token.
 */
export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;

  const name = 'authToken=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return decodeURIComponent(c.substring(name.length));
    }
  }
  return null;
}

export function setAuthToken(token: string, remember: boolean = false): void {
  if (typeof document === 'undefined') return;

  let expires = '';
  if (remember) {
    const date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
    expires = "; expires=" + date.toUTCString();
  }

  // Set cookie with security best practices
  // Note: HttpOnly cannot be set via JavaScript
  document.cookie = `authToken=${encodeURIComponent(token)}${expires}; path=/; SameSite=Strict; Secure`;
}

export function clearAuthToken(): void {
  if (typeof document === 'undefined') return;

  // Clear by setting expiration to the past
  document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure";

  // Also clear legacy storage just in case
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
}

/**
 * Common API endpoints
 */
export const apiEndpoints = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    refreshToken: '/api/auth/refresh'
  },
  users: {
    profile: '/api/users/profile',
    update: '/api/users/update',
    delete: '/api/users/delete'
  },
  posts: {
    list: '/api/posts',
    create: '/api/posts',
    update: (id: string) => `/api/posts/${id}`,
    delete: (id: string) => `/api/posts/${id}`
  }
};

export default {
  useApi,
  useApiData,
  apiUtils,
  apiEndpoints,
  getAuthToken,
  setAuthToken,
  clearAuthToken
};