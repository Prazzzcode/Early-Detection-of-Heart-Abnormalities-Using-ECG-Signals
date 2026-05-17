'use client';

import { createContext, useContext, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const AuthContext = createContext();

const PUBLIC_ROUTES = ['/login', '/register', '/onboarding', '/instructions'];

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user || null;
  const authLoading = status === 'loading';

  // Redirect to login if not authenticated (except on public routes)
  useEffect(() => {
    if (status === 'unauthenticated' && !PUBLIC_ROUTES.includes(pathname)) {
      router.push('/login');
    }
  }, [status, pathname, router]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const value = {
    user,
    authLoading,
    isAuthenticated: !!user,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
