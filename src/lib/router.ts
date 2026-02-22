export const routerUtils = {
  /**
   * Convert path to regex for matching
   */
  pathToRegex: (path: string, exact: boolean = false) => {
    // Escape special characters but keep : and * for our own replacement
    const escapedPath = path
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/:[^\s/]+/g, '([^/]+)')
      .replace(/\*/g, '(?:.*)');

    const regex = new RegExp(`^${escapedPath}${exact ? '$' : ''}`);
    return regex;
  },

  /**
   * Extract parameters from a path based on a pattern
   */
  extractParams: (pattern: string, path: string) => {
    const paramNames = (pattern.match(/:[^\s/]+/g) || []).map(p => p.slice(1));
    const regex = routerUtils.pathToRegex(pattern, true);
    const match = path.match(regex);

    if (!match) return null;

    const params: Record<string, string> = {};
    paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });

    return params;
  },

  /**
   * Build a URL from a pattern and parameters
   */
  buildUrl: (pattern: string, params: Record<string, string | number>) => {
    let url = pattern;
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
    return url;
  }
};
