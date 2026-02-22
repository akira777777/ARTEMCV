import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAuthToken, setAuthToken, clearAuthToken } from '../lib/api';

describe('API Security - Auth Token Storage', () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    // Clear localStorage/sessionStorage
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sets authToken in cookies instead of localStorage', () => {
    const token = 'test-token-123';
    setAuthToken(token);

    expect(document.cookie).toContain('authToken=test-token-123');
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(sessionStorage.getItem('authToken')).toBeNull();
  });

  it('retrieves authToken from cookies', () => {
    const token = 'test-token-456';
    document.cookie = `authToken=${token}; path=/`;

    const retrievedToken = getAuthToken();
    expect(retrievedToken).toBe(token);
  });

  it('clears authToken from cookies', () => {
    document.cookie = 'authToken=test-token-789; path=/';
    expect(document.cookie).toContain('authToken=test-token-789');

    clearAuthToken();

    // In JSDOM, setting an expired cookie might not immediately remove it from document.cookie
    // string in the same tick or depends on implementation, but let's check.
    expect(getAuthToken()).toBeNull();
  });

  it('applies Secure and SameSite=Strict attributes (mocked)', () => {
    const cookieSpy = vi.spyOn(document, 'cookie', 'set');
    setAuthToken('secure-token');

    expect(cookieSpy).toHaveBeenCalledWith(expect.stringContaining('SameSite=Strict'));
    expect(cookieSpy).toHaveBeenCalledWith(expect.stringContaining('Secure'));
  });

  it('sets expiration date when remember is true', () => {
    const cookieSpy = vi.spyOn(document, 'cookie', 'set');
    setAuthToken('remember-token', true);

    expect(cookieSpy).toHaveBeenCalledWith(expect.stringContaining('expires='));
  });

  it('encodes and decodes special characters in token', () => {
    const token = 'token with spaces & symbols!';
    setAuthToken(token);

    expect(document.cookie).toContain('authToken=' + encodeURIComponent(token));
    expect(getAuthToken()).toBe(token);
  });
});
