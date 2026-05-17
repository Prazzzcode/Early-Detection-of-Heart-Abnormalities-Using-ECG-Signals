/**
 * Authentication module for Next.js App Router with NextAuth
 * Handles user authentication with MongoDB backend
 * Supports OAuth (Google, Facebook, GitHub) and email/password
 */

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { handler } from '@/app/api/auth/[...nextauth]/route';

export { handler as nextAuthHandler };

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password (min 8 chars)
 * @param {string} fullName - User full name
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function signUp(email, password, fullName) {
  try {
    if (!email || !password || !fullName) {
      throw new Error('Email, password, and full name are required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const response = await fetch(`${API_BASE}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, fullName }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Sign up failed');
    }

    // User created successfully, redirect to login
    return { data, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function signIn(email, password) {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const result = await nextAuthSignIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!result?.ok) {
      throw new Error(result?.error || 'Sign in failed');
    }

    return { data: result, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Sign in with OAuth provider
 * @param {string} provider - OAuth provider ('google', 'facebook', 'github')
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function signInWithSocialProvider(provider) {
  try {
    const validProviders = ['google', 'facebook', 'github'];
    if (!validProviders.includes(provider)) {
      throw new Error(`Invalid provider: ${provider}`);
    }

    const result = await nextAuthSignIn(provider, {
      redirect: true,
      callbackUrl: '/',
    });

    return { data: result, error: null };
  } catch (error) {
    console.error(`${provider} sign in error:`, error);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Get current user session (server-side only)
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(handler);
    return session?.user || null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Logout user
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await nextAuthSignOut({ redirect: true, callbackUrl: '/login' });
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Get server session (for use in route handlers)
 * @returns {Promise<Object|null>}
 */
export async function getServerSessionData() {
  try {
    return await getServerSession(handler);
  } catch (error) {
    console.error('Get server session error:', error);
    return null;
  }
}

/**
 * Sign in user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function signIn(email, password) {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Include cookies for session
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Sign in failed');
    }

    // Store user data in localStorage
    if (data.user?._id) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('sessionToken', data.token || ''); // If backend provides token
    }

    return { data: data.user, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Sign in with social provider (Google, GitHub, etc.)
 * @param {string} provider - OAuth provider name
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function signInWithSocialProvider(provider) {
  try {
    if (!provider) {
      throw new Error('Provider is required');
    }

    const response = await fetch(`${API_BASE}/api/auth/social/${provider}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `${provider} sign in failed`);
    }

    if (data.user?._id) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('sessionToken', data.token || '');
    }

    return { data: data.user, error: null };
  } catch (error) {
    console.error('Social sign in error:', error);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Logout current user
 * Clears all authentication state and cookies
 * @returns {Promise<{error: Object|null}>}
 */
export async function logout() {
  try {
    // Call backend to invalidate session/token
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).catch((e) => {
      // Even if backend call fails, clear client state
      console.warn('Logout API call failed:', e);
    });

    // Clear all authentication-related data
    localStorage.removeItem('user');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('authToken');
    
    // Clear any other cached data
    sessionStorage.clear();

    // Clear cookies (backend should do this, but we can't set httpOnly cookies from client)
    // This clears visible cookies
    if (typeof document !== 'undefined') {
      document.cookie.split(';').forEach((c) => {
        const eqPos = c.indexOf('=');
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    }

    return { error: null };
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local state even if API call fails
    localStorage.removeItem('user');
    localStorage.removeItem('sessionToken');
    return { error: { message: error.message } };
  }
}

/**
 * Get current session user from backend
 * Validates session is still active
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      // Session expired or invalid
      localStorage.removeItem('user');
      localStorage.removeItem('sessionToken');
      return { data: null, error: { message: 'Session expired' } };
    }

    const data = await response.json();
    return { data: data.user, error: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function updateUserProfile(userId, userData) {
  try {
    const response = await fetch(`${API_BASE}/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Profile update failed');
    }

    // Update stored user data
    localStorage.setItem('user', JSON.stringify(data));

    return { data, error: null };
  } catch (error) {
    console.error('Profile update error:', error);
    return { data: null, error: { message: error.message } };
  }
}

