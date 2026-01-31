/**
 * Development logging utility
 * Only outputs logs in development environment
 */

const isDev = process.env.NODE_ENV === 'development';

export const devLog = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log('[DEV]', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn('[DEV]', ...args);
    }
  },
  
  error: (...args: any[]) => {
    if (isDev) {
      console.error('[DEV]', ...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDev) {
      console.info('[DEV]', ...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug('[DEV]', ...args);
    }
  },
  
  group: (label: string) => {
    if (isDev) {
      console.group(`[DEV] ${label}`);
    }
  },
  
  groupEnd: () => {
    if (isDev) {
      console.groupEnd();
    }
  }
};

// Production-safe logging that works in all environments
export const logger = {
  log: (...args: any[]) => console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
  info: (...args: any[]) => console.info(...args)
};

export default devLog;