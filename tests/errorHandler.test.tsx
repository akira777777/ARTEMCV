import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';
import { errorUtils } from '../lib/errorHandler';

// Mock global objects
const originalLocation = window.location;
const originalNavigator = window.navigator;

describe('errorUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock window.location
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      href: 'http://localhost/test',
      reload: vi.fn(),
    } as any;

    // Mock navigator
    Object.defineProperty(window, 'navigator', {
      configurable: true,
      value: {
        ...originalNavigator,
        userAgent: 'test-user-agent',
        serviceWorker: {
          getRegistrations: vi.fn().mockResolvedValue([]),
        },
        permissions: {
          query: vi.fn(),
        },
        geolocation: {
          getCurrentPosition: vi.fn(),
        },
      },
    });

    // Mock caches
    (window as any).caches = {
      keys: vi.fn().mockResolvedValue([]),
      delete: vi.fn().mockResolvedValue(true),
    };

    // Mock Notification
    (window as any).Notification = {
      requestPermission: vi.fn().mockResolvedValue('granted'),
    };

    // Mock localStorage
    vi.spyOn(Storage.prototype, 'clear');
    vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(Storage.prototype, 'removeItem');

    // Mock fetch
    global.fetch = vi.fn();

    // Mock console
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    window.location = originalLocation;
    Object.defineProperty(window, 'navigator', {
      configurable: true,
      value: originalNavigator,
    });
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(errorUtils).toBeDefined();
  });

  describe('createErrorInfo', () => {
    it('should create ErrorInfo from an Error object', () => {
      const error = new Error('Test error');
      error.stack = 'test stack';
      const info = errorUtils.createErrorInfo(error);

      expect(info.message).toBe('Test error');
      expect(info.stack).toBe('test stack');
      expect(info.timestamp).toBeLessThanOrEqual(Date.now());
      expect(info.url).toBe('http://localhost/test');
      expect(info.userAgent).toBe('test-user-agent');
      expect(info.severity).toBe('medium');
      expect(info.category).toBe('runtime');
    });

    it('should create ErrorInfo from a string', () => {
      const info = errorUtils.createErrorInfo('String error');

      expect(info.message).toBe('String error');
      expect(info.stack).toBeUndefined();
      expect(info.severity).toBe('medium');
    });

    it('should accept custom severity and category', () => {
      const info = errorUtils.createErrorInfo('Custom error', {}, 'high', 'network');

      expect(info.severity).toBe('high');
      expect(info.category).toBe('network');
    });

    it('should include context if provided', () => {
      const context = { userId: '123' };
      const info = errorUtils.createErrorInfo('Context error', context);

      expect(info.context).toEqual(context);
    });
  });

  describe('logError', () => {
    it('should log error with default level (error)', () => {
      const info = errorUtils.createErrorInfo('Log test');
      errorUtils.logError(info);

      expect(console.error).toHaveBeenCalledWith(
        '[Error]',
        expect.objectContaining({
          message: 'Log test',
        }),
      );
    });

    it('should log error with specified level', () => {
      const info = errorUtils.createErrorInfo('Warn test');
      errorUtils.logError(info, 'warn');

      expect(console.warn).toHaveBeenCalledWith(
        '[Error]',
        expect.objectContaining({
          message: 'Warn test',
        }),
      );
    });

    it('should fallback to console.error if level is invalid', () => {
      const info = errorUtils.createErrorInfo('Invalid level test');
      // @ts-expect-error - testing invalid input
      errorUtils.logError(info, 'invalid');

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('reportError', () => {
    it('should report error successfully', async () => {
      (global.fetch as any).mockResolvedValue({ ok: true });
      const info = errorUtils.createErrorInfo('Report test');
      const result = await errorUtils.reportError(info);

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/errors',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(info),
        }),
      );
    });

    it('should return false when reporting fails', async () => {
      (global.fetch as any).mockResolvedValue({ ok: false });
      const info = errorUtils.createErrorInfo('Report fail test');
      const result = await errorUtils.reportError(info);

      expect(result).toBe(false);
    });

    it('should return false and log error when fetch throws', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));
      const info = errorUtils.createErrorInfo('Report throw test');
      const result = await errorUtils.reportError(info);

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Failed to report error:', expect.any(Error));
    });
  });

  describe('fetchWithRetry', () => {
    it('should fetch successfully on first attempt', async () => {
      const mockData = { data: 'test' };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      });

      const result = await errorUtils.fetchWithRetry('/api/test');
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const mockData = { data: 'success' };
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: false, status: 500 })
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue(mockData),
        });

      const result = await errorUtils.fetchWithRetry('/api/retry', {}, 3, 10);
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should throw error after max retries', async () => {
      (global.fetch as any).mockResolvedValue({ ok: false, status: 500 });

      await expect(errorUtils.fetchWithRetry('/api/fail', {}, 2, 10)).rejects.toThrow(
        'HTTP error! status: 500',
      );
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should retry on network error', async () => {
      const mockData = { data: 'recovered' };
      (global.fetch as any).mockRejectedValueOnce(new Error('Network fail')).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      });

      const result = await errorUtils.fetchWithRetry('/api/network-retry', {}, 3, 10);
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('createRecoveryStrategies', () => {
    it('should return all recovery strategies', () => {
      const strategies = errorUtils.createRecoveryStrategies();
      expect(strategies).toHaveLength(4);
      expect(strategies.map((s) => s.id)).toEqual([
        'cache-clear',
        'service-worker-reset',
        'local-storage-reset',
        'page-reload',
      ]);
    });

    it('should execute cache-clear strategy', async () => {
      const strategies = errorUtils.createRecoveryStrategies();
      const strategy = strategies.find((s) => s.id === 'cache-clear')!;

      (window.caches.keys as any).mockResolvedValue(['cache1', 'cache2']);

      const result = await strategy.execute();
      expect(result).toBe(true);
      expect(window.caches.delete).toHaveBeenCalledWith('cache1');
      expect(window.caches.delete).toHaveBeenCalledWith('cache2');
    });

    it('should execute service-worker-reset strategy', async () => {
      const strategies = errorUtils.createRecoveryStrategies();
      const strategy = strategies.find((s) => s.id === 'service-worker-reset')!;

      const mockUnregister = vi.fn().mockResolvedValue(true);
      (navigator.serviceWorker.getRegistrations as any).mockResolvedValue([
        { unregister: mockUnregister },
      ]);

      const result = await strategy.execute();
      expect(result).toBe(true);
      expect(mockUnregister).toHaveBeenCalled();
    });

    it('should execute local-storage-reset strategy', async () => {
      const strategies = errorUtils.createRecoveryStrategies();
      const strategy = strategies.find((s) => s.id === 'local-storage-reset')!;

      const result = await strategy.execute();
      expect(result).toBe(true);
      expect(localStorage.clear).toHaveBeenCalled();
    });

    it('should execute page-reload strategy', async () => {
      const strategies = errorUtils.createRecoveryStrategies();
      const strategy = strategies.find((s) => s.id === 'page-reload')!;

      const result = await strategy.execute();
      expect(result).toBe(true);
      expect(window.location.reload).toHaveBeenCalled();
    });

    it('should handle failures in strategies', async () => {
      const strategies = errorUtils.createRecoveryStrategies();
      const strategy = strategies.find((s) => s.id === 'cache-clear')!;

      (window.caches.keys as any).mockRejectedValue(new Error('Cache fail'));

      const result = await strategy.execute();
      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('Cache clear failed:', expect.any(Error));
    });
  });

  describe('handlePermissionError', () => {
    it('should resolve with granted if permission is already granted', async () => {
      (navigator.permissions.query as any).mockResolvedValue({ state: 'granted' });

      const result = await errorUtils.handlePermissionError('notifications');
      expect(result).toBe('granted');
    });

    it('should request notification permission if state is prompt', async () => {
      (navigator.permissions.query as any).mockResolvedValue({ state: 'prompt' });
      (window.Notification.requestPermission as any).mockResolvedValue('granted');

      const result = await errorUtils.handlePermissionError('notifications');
      expect(result).toBe('granted');
      expect(window.Notification.requestPermission).toHaveBeenCalled();
    });

    it('should request geolocation if state is prompt', async () => {
      (navigator.permissions.query as any).mockResolvedValue({ state: 'prompt' });
      (navigator.geolocation.getCurrentPosition as any).mockImplementation((success: any) =>
        success(),
      );

      const result = await errorUtils.handlePermissionError('geolocation');
      expect(result).toBe('granted');
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    });

    it('should reject if permission is denied', async () => {
      (navigator.permissions.query as any).mockResolvedValue({ state: 'denied' });

      await expect(errorUtils.handlePermissionError('notifications')).rejects.toThrow(
        'Permission notifications denied',
      );
    });
  });

  describe('createErrorBoundary', () => {
    const TestComponent = () => <div>Test Component</div>;
    const FallbackComponent = ({ error }: { error: Error }) => <div>Fallback: {error.message}</div>;

    it('should render the component when there is no error', () => {
      const Wrapped = errorUtils.createErrorBoundary(TestComponent);
      const { getByText } = render(<Wrapped />);

      expect(getByText('Test Component')).toBeDefined();
    });

    it('should render fallback when a window error occurs', () => {
      const Wrapped = errorUtils.createErrorBoundary(TestComponent, FallbackComponent);
      const { getByText } = render(<Wrapped />);

      act(() => {
        const errorEvent = new ErrorEvent('error', {
          message: 'HOC error',
          error: new Error('HOC error'),
        });
        window.dispatchEvent(errorEvent);
      });

      expect(getByText('Fallback: HOC error')).toBeDefined();
    });

    it('should render default fallback when no fallback component is provided', () => {
      const Wrapped = errorUtils.createErrorBoundary(TestComponent);
      const { getByText } = render(<Wrapped />);

      act(() => {
        window.dispatchEvent(new ErrorEvent('error', { message: 'Default fallback error' }));
      });

      expect(getByText('Something went wrong')).toBeDefined();
      expect(getByText('Default fallback error')).toBeDefined();
    });
  });
});
