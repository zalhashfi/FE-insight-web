import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import * as apiModule from '../lib/api';

describe('AuthContext', () => {
  beforeEach(() => {
    sessionStorage.clear();
    apiModule.setAuthToken(null);
    vi.restoreAllMocks();
  });

  it('provides initial unauthenticated state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('stores user and jwt token upon successful login', async () => {
    const fakeToken = 'test.jwt.token';
    const fakeUser = { id: 1, email: 'admin@example.com', fullName: 'Admin User', role: 'admin' as const };

    const setAuthTokenSpy = vi.spyOn(apiModule, 'setAuthToken');
    vi.spyOn(apiModule, 'apiFetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ user: fakeUser, token: fakeToken }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('admin@example.com', 'password123');
    });

    expect(result.current.user).toEqual(fakeUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(sessionStorage.getItem('insight_user')).toBe(JSON.stringify(fakeUser));
    expect(setAuthTokenSpy).toHaveBeenCalledWith(fakeToken);
    expect(apiModule.getAuthToken()).toBe(fakeToken);
  });

  it('clears user and jwt token upon logout', async () => {
    const fakeToken = 'test.jwt.token';
    const fakeUser = { id: 1, email: 'admin@example.com', fullName: 'Admin User', role: 'admin' as const };

    sessionStorage.setItem('insight_user', JSON.stringify(fakeUser));
    apiModule.setAuthToken(fakeToken);

    const setAuthTokenSpy = vi.spyOn(apiModule, 'setAuthToken');
    vi.spyOn(apiModule, 'apiFetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Logged out' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(fakeUser);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(sessionStorage.getItem('insight_user')).toBeNull();
    expect(setAuthTokenSpy).toHaveBeenCalledWith(null);
    expect(apiModule.getAuthToken()).toBeNull();
  });
});
