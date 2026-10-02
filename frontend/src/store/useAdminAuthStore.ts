'use client';

import { create } from 'zustand';
import { AdminUser, AdminLoginPayload } from '@/types/api';
import { api, ApiClientError } from '@/lib/api';

const COOKIE_NAME = 'admin_token';
const STORAGE_KEY = 'stars_admin_session';

interface AdminAuthState {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  login: (payload: AdminLoginPayload) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setSession: (token: string, user: AdminUser) => void;
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [k, v] = cookie.trim().split('=');
    if (k === name && v) {
      return decodeURIComponent(v);
    }
  }
  return null;
}

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  setSession: (token: string, user: AdminUser) => {
    setCookie(COOKIE_NAME, token);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
      } catch {
        // Storage might fail in incognito/restricted mode
      }
    }
    set({
      token,
      user,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
    });
  },

  login: async (payload: AdminLoginPayload) => {
    set({ isLoading: true });
    try {
      const response = await api.admin.login(payload);
      if (response.success && response.data?.token) {
        const adminUser = response.data.user || response.data.admin;
        get().setSession(response.data.token, adminUser);
        return { success: true, message: response.message || 'Login berhasil.' };
      }

      set({ isLoading: false });
      return { success: false, message: response.message || 'Gagal masuk. Periksa kembali kredensial Anda.' };
    } catch (err: unknown) {
      set({ isLoading: false });
      if (err instanceof ApiClientError) {
        return { success: false, message: err.message };
      }
      return { success: false, message: 'Terjadi kesalahan saat menghubungi server autentikasi.' };
    }
  },

  logout: async () => {
    const currentToken = get().token;
    set({ isLoading: true });
    try {
      if (currentToken) {
        await api.admin.logout(currentToken);
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      removeCookie(COOKIE_NAME);
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
      }
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  checkAuth: async () => {
    if (typeof window === 'undefined') {
      return false;
    }

    set({ isLoading: true });

    let token = get().token;
    let savedUser = get().user;

    // Try reading from localStorage if not in memory
    if (!token) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          token = parsed.token || null;
          savedUser = parsed.user || null;
        }
      } catch {
        // ignore
      }
    }

    // Try reading from cookie if still not found
    if (!token) {
      token = getCookie(COOKIE_NAME);
    }

    if (!token) {
      removeCookie(COOKIE_NAME);
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
      return false;
    }

    // Set cookie to keep in sync
    setCookie(COOKIE_NAME, token);

    try {
      const response = await api.admin.me(token);
      if (response.success && response.data) {
        const user = response.data.user || response.data.admin || savedUser;
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
        return true;
      }

      // Invalid response
      await get().logout();
      return false;
    } catch (err: unknown) {
      // If unauthorized 401 from server, session expired
      if (err instanceof ApiClientError && err.statusCode === 401) {
        await get().logout();
        return false;
      }

      // If network offline error but we have saved user, preserve session for resilient dev
      if (savedUser) {
        set({
          token,
          user: savedUser,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
        return true;
      }

      await get().logout();
      return false;
    }
  },
}));
