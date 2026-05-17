import './globals.css';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '../components/theme-provider';
import Navigation from '../components/navigation';
import { AuthProvider } from '../context/authContext';
import { Toaster } from '../components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HeartGuard - Heart Abnormality Detection',
  description: 'Advanced heart abnormality detection system for early diagnosis and monitoring',
};

/**
 * Root Layout Component
 * 
 * Note: Context providers are intentionally separated from main layout
 * to prevent unnecessary re-renders of static content.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Performance: Preconnect to MongoDB */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || ''} />
      </head>
      <body className={inter.className}>
        {/* NextAuth Session Provider - handles authentication sessions */}
        <SessionProvider>
          {/* Theme Provider - handles dark/light mode */}
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange={false}
          >
            {/* Auth Provider - handles user authentication state */}
            <AuthProvider>
              {/* Navigation - uses auth context */}
              <Navigation />
              
              {/* Main content */}
              <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-black dark:to-gray-900 transition-colors duration-300">
                {children}
              </main>
              
              {/* Toast notifications */}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}