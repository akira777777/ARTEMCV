/**
 * API Client Module
 * 
 * Provides a consistent, type-safe interface for making API requests
 * with automatic error handling, retries, and request/response interceptors.
 * 
 * @example
 * ```typescript
 * const api = createApiClient({ baseUrl: '/api' });
 * const response = await api.post('/send-telegram', { name, email, message });
 * ```
 */

import { fetchWithTimeout } from './utils';

// ============================================================================
// Types
// ============================================================================

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Headers;
}

export interface ApiError extends Error {
  status: number;
  data?: unknown;
  isRetryable: boolean;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// ============================================================================
// Error Classes
// ============================================================================

export class ApiRequestError extends Error implements ApiError {
  public readonly status: number;
  public readonly data?: unknown;
  public readonly isRetryable: boolean;

  constructor(
    message: string,
    status: number,
    data?: unknown,
    isRetryable = false
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.data = data;
    this.isRetryable = isRetryable;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiRequestError);
    }
  }
}

export class NetworkError extends ApiRequestError {
  constructor(message = 'Network error occurred') {
    super(message, 0, undefined, true);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiRequestError {
  constructor(message = 'Request timeout') {
    super(message, 408, undefined, true);
    this.name = 'TimeoutError';
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Determines if an HTTP status code indicates a retryable error
 */
function isRetryableStatus(status: number): boolean {
  return (
    status === 408 || // Request Timeout
    status === 429 || // Too Many Requests
    status === 500 || // Internal Server Error
    status === 502 || // Bad Gateway
    status === 503 || // Service Unavailable
    status === 504    // Gateway Timeout
  );
}

/**
 * Delay execution for a specified number of milliseconds
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateRetryDelay(attempt: number, baseDelay: number): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay; // 30% jitter
  return Math.min(exponentialDelay + jitter, 30000); // Max 30 seconds
}

// ============================================================================
// API Client Factory
// ============================================================================

export function createApiClient(config: ApiClientConfig) {
  const {
    baseUrl,
    timeout = 12000,
    retries = 3,
    retryDelay = 1000,
    headers: defaultHeaders = {},
  } = config;

  /**
   * Make an HTTP request with automatic retries and error handling
   */
  async function request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown,
    requestConfig: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = `${baseUrl}${endpoint}`;
    const requestTimeout = requestConfig.timeout ?? timeout;
    const maxRetries = requestConfig.retries ?? retries;
    const baseRetryDelay = retryDelay;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...defaultHeaders,
      ...requestConfig.headers,
    };

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
      signal: requestConfig.signal,
    };

    if (body && method !== 'GET') {
      requestInit.body = JSON.stringify(body);
    }

    let lastError: ApiRequestError | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetchWithTimeout(url, requestInit, requestTimeout);

        // Parse response body
        let data: T;
        const contentType = response.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          data = await response.json() as T;
        } else {
          data = await response.text() as unknown as T;
        }

        // Handle HTTP errors
        if (!response.ok) {
          throw new ApiRequestError(
            typeof data === 'string' ? data : (data as any)?.error || `HTTP ${response.status}`,
            response.status,
            data,
            isRetryableStatus(response.status) && attempt < maxRetries
          );
        }

        return {
          data,
          status: response.status,
          headers: response.headers,
        };
      } catch (error) {
        if (error instanceof ApiRequestError) {
          lastError = error;

          // Don't retry if not retryable or if manually aborted
          if (!error.isRetryable || requestConfig.signal?.aborted) {
            throw error;
          }
        } else if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new TimeoutError();
          }
          
          // Network errors are retryable
          lastError = new NetworkError(error.message);
          
          if (requestConfig.signal?.aborted) {
            throw lastError;
          }
        } else {
          lastError = new ApiRequestError('Unknown error occurred', 0);
        }

        // Wait before retrying (except on the last attempt)
        if (attempt < maxRetries) {
          const waitTime = calculateRetryDelay(attempt, baseRetryDelay);
          await delay(waitTime);
        }
      }
    }

    // All retries exhausted
    throw lastError || new ApiRequestError('Request failed after retries', 0);
  }

  // Return API client interface
  return {
    get: <T>(endpoint: string, config?: ApiRequestConfig) =>
      request<T>('GET', endpoint, undefined, config),
    
    post: <T>(endpoint: string, body: unknown, config?: ApiRequestConfig) =>
      request<T>('POST', endpoint, body, config),
    
    put: <T>(endpoint: string, body: unknown, config?: ApiRequestConfig) =>
      request<T>('PUT', endpoint, body, config),
    
    patch: <T>(endpoint: string, body: unknown, config?: ApiRequestConfig) =>
      request<T>('PATCH', endpoint, body, config),
    
    delete: <T>(endpoint: string, config?: ApiRequestConfig) =>
      request<T>('DELETE', endpoint, undefined, config),

    // Raw request method for custom use cases
    request,
  };
}

// ============================================================================
// Default API Client
// ============================================================================

/**
 * Default API client instance configured for the portfolio application
 */
export const apiClient = createApiClient({
  baseUrl: '',
  timeout: 12000,
  retries: 2,
});

export default apiClient;
