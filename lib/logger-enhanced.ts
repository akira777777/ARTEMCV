/**
 * Enhanced Logging System
 * 
 * Provides structured, level-based logging with support for:
 * - Environment-based log level filtering
 * - Structured JSON logging for production
 * - Pretty printing for development
 * - Log correlation IDs for request tracing
 * - Batched log shipping for analytics
 * 
 * @example
 * ```typescript
 * const logger = createLogger({ context: 'ContactForm' });
 * logger.info('Form submitted', { email: userEmail });
 * ```
 */

// ============================================================================
// Types
// ============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  correlationId?: string;
  data?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    name?: string;
  };
}

export interface LoggerConfig {
  context?: string;
  correlationId?: string;
  minLevel?: LogLevel;
  enableConsole?: boolean;
  enableBatching?: boolean;
  batchSize?: number;
  flushInterval?: number;
}

// ============================================================================
// Constants
// ============================================================================

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

const DEFAULT_CONFIG: Required<LoggerConfig> = {
  context: 'App',
  correlationId: '',
  minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  enableConsole: true,
  enableBatching: false,
  batchSize: 100,
  flushInterval: 5000,
};

// ============================================================================
// Storage Buffers
// ============================================================================

let logBuffer: LogEntry[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a unique correlation ID for request tracing
 */
export function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if current environment supports the required log level
 */
function shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

/**
 * Format a log entry for console output (development)
 */
function formatForConsole(entry: LogEntry): string {
  const timestamp = new Date(entry.timestamp).toLocaleTimeString();
  const levelColor = getLevelColor(entry.level);
  const context = entry.context ? `[${entry.context}]` : '';
  const correlation = entry.correlationId ? `(${entry.correlationId.slice(0, 8)})` : '';
  
  let output = `${timestamp} ${levelColor}${entry.level.toUpperCase()}\x1b[0m ${context} ${correlation} ${entry.message}`;
  
  if (entry.data && Object.keys(entry.data).length > 0) {
    output += '\n  ' + JSON.stringify(entry.data, null, 2).replace(/\n/g, '\n  ');
  }
  
  if (entry.error) {
    output += `\n  Error: ${entry.error.message}`;
    if (entry.error.stack && process.env.NODE_ENV !== 'production') {
      output += `\n  ${entry.error.stack}`;
    }
  }
  
  return output;
}

/**
 * Get ANSI color code for log level
 */
function getLevelColor(level: LogLevel): string {
  switch (level) {
    case 'debug': return '\x1b[36m'; // Cyan
    case 'info': return '\x1b[32m';  // Green
    case 'warn': return '\x1b[33m';  // Yellow
    case 'error': return '\x1b[31m'; // Red
    case 'fatal': return '\x1b[35m'; // Magenta
    default: return '\x1b[0m';
  }
}

/**
 * Serialize an error object for logging
 */
function serializeError(error: unknown): LogEntry['error'] | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }
  
  return {
    message: error.message,
    name: error.name,
    stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
  };
}

/**
 * Flush buffered logs (for batching mode)
 */
async function flushLogs(logs: LogEntry[]): Promise<void> {
  if (logs.length === 0) return;
  
  // In production, you might send these to a log aggregation service
  // For now, we just output to console in JSON format
  if (process.env.NODE_ENV === 'production') {
    logs.forEach(log => {
      console.log(JSON.stringify(log));
    });
  }
}

/**
 * Schedule a buffer flush
 */
function scheduleFlush(interval: number): void {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
  }
  
  flushTimeout = setTimeout(() => {
    const logsToFlush = [...logBuffer];
    logBuffer = [];
    flushLogs(logsToFlush);
  }, interval);
}

// ============================================================================
// Logger Factory
// ============================================================================

export function createLogger(config: LoggerConfig = {}) {
  const {
    context,
    correlationId,
    minLevel,
    enableConsole,
    enableBatching,
    batchSize,
    flushInterval,
  } = { ...DEFAULT_CONFIG, ...config };

  /**
   * Core logging function
   */
  function log(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
    error?: unknown
  ): void {
    if (!shouldLog(level, minLevel)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      correlationId,
      data,
      error: serializeError(error),
    };

    // Console output for development
    if (enableConsole && process.env.NODE_ENV !== 'production') {
      const formatted = formatForConsole(entry);
      switch (level) {
        case 'debug':
          console.log(formatted);
          break;
        case 'info':
          console.info(formatted);
          break;
        case 'warn':
          console.warn(formatted);
          break;
        case 'error':
        case 'fatal':
          console.error(formatted);
          break;
      }
    }

    // JSON output for production
    if (process.env.NODE_ENV === 'production' && !enableBatching) {
      console.log(JSON.stringify(entry));
    }

    // Batched logging
    if (enableBatching) {
      logBuffer.push(entry);
      
      if (logBuffer.length >= batchSize) {
        const logsToFlush = [...logBuffer];
        logBuffer = [];
        flushLogs(logsToFlush);
      } else {
        scheduleFlush(flushInterval);
      }
    }
  }

  // Return logger interface
  return {
    debug: (message: string, data?: Record<string, unknown>) => 
      log('debug', message, data),
    
    info: (message: string, data?: Record<string, unknown>) => 
      log('info', message, data),
    
    warn: (message: string, data?: Record<string, unknown>, error?: unknown) => 
      log('warn', message, data, error),
    
    error: (message: string, error?: unknown, data?: Record<string, unknown>) => 
      log('error', message, data, error),
    
    fatal: (message: string, error?: unknown, data?: Record<string, unknown>) => 
      log('fatal', message, data, error),

    /**
     * Create a child logger with additional context
     */
    child: (childContext: string) => 
      createLogger({
        ...config,
        context: `${context}.${childContext}`,
      }),

    /**
     * Flush any buffered logs
     */
    flush: async () => {
      if (logBuffer.length > 0) {
        const logsToFlush = [...logBuffer];
        logBuffer = [];
        await flushLogs(logsToFlush);
      }
    },
  };
}

// ============================================================================
// Default Logger Instance
// ============================================================================

export const logger = createLogger();

// ============================================================================
// React Integration Hook
// ============================================================================

import { useCallback, useRef } from 'react';

/**
 * React hook for using the logger in components
 * Automatically generates a correlation ID for the component lifecycle
 */
export function useLogger(context: string) {
  const correlationId = useRef(generateCorrelationId()).current;
  const componentLogger = useRef(
    createLogger({ context, correlationId })
  ).current;

  const logError = useCallback((message: string, error: unknown) => {
    componentLogger.error(message, error);
  }, [componentLogger]);

  const logInfo = useCallback((message: string, data?: Record<string, unknown>) => {
    componentLogger.info(message, data);
  }, [componentLogger]);

  return {
    logger: componentLogger,
    logError,
    logInfo,
    correlationId,
  };
}

export default logger;
