"use client";

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Heart, Menu, X, Home, BookOpen, LogIn, Activity, History, Shield, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { logout } from '../lib/auth';
import { useToast } from '../hooks/use-toast';

export default function Navigation() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState({})
  const { user: userData } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();


  useEffect(() => {
    setUser(userData)
  }, [userData])

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  const isActive = (href) => pathname === href;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group hover:opacity-80 transition-opacity duration-200">
            <div className="p-2.5 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              HeartGuard
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 relative ${isActive('/')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Home</span>
              {isActive('/') && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              )}
            </Link>


            {user && (<>
              <Link
                href="/take-reading"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 relative ${isActive('/take-reading')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
              >
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">Take Reading</span>
                {isActive('/take-reading') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </Link>

              <Link
                href="/past-readings"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 relative ${isActive('/past-readings')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
              >
                <History className="h-4 w-4" />
                <span className="text-sm font-medium">Past Readings</span>
                {isActive('/past-readings') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </Link>

              {/* <Link
                href="/health-status"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 relative ${isActive('/health-status')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
              >
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Health Status</span>
                {isActive('/health-status') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </Link> */}

              <Link
                href="/instructions"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 relative ${isActive('/instructions')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
              >
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">Instructions</span>
                {isActive('/instructions') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </Link>

              <Link
                href="/profile"
                className="flex items-center ml-4"
                title="Profile"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isActive('/profile')
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                    : 'bg-gradient-to-br from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 hover:scale-105'
                  }`}>
                  <User className="h-5 w-5 text-white" />
                </div>
              </Link>

              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 ml-4" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </>
            )}
            {!user && (<>
              <Link
                href="/instructions"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 relative ${isActive('/instructions')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
              >
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">Instructions</span>
                {isActive('/instructions') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </Link>

              <Link
                href="/register"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-200 ml-2"
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Register</span>
              </Link>

              <Link
                href="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 ml-2"
              >
                <LogIn className="h-4 w-4" />
                <span className="text-sm font-medium">Login</span>
              </Link>
            </>)}
          </div>

          {/* Theme toggle and mobile menu */}
          <div className="flex items-center space-x-3">
            {mounted ? (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            ) : (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                aria-label="Toggle theme"
              >
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            )
            }

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-in slide-in-from-top-2 duration-200">
            <div className="py-2 space-y-1">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${isActive('/')
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>

              <Link
                href="/instructions"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${isActive('/instructions')
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <BookOpen className="h-5 w-5" />
                <span>Instructions</span>
              </Link>

              {user && (
                <>
                  <Link
                    href="/take-reading"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${isActive('/take-reading')
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    <Activity className="h-5 w-5" />
                    <span>Take Reading</span>
                  </Link>

                  <Link
                    href="/past-readings"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${isActive('/past-readings')
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    <History className="h-5 w-5" />
                    <span>Past Readings</span>
                  </Link>

                  {/* <Link
                    href="/health-status"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${isActive('/health-status')
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    <Shield className="h-5 w-5" />
                    <span>Health Status</span>
                  </Link> */}

                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${isActive('/profile')
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {!user && (
                <>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-200"
                  >
                    <User className="h-5 w-5" />
                    <span>Register</span>
                  </Link>

                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}