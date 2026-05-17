import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import GitHubProvider from 'next-auth/providers/github';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

/**
 * NextAuth configuration
 * Handles:
 * - Email/Password authentication with bcrypt
 * - OAuth with Google, Facebook, GitHub
 * - MongoDB adapter for session storage
 */
const handler = NextAuth({
  providers: [
    // Email/Password Authentication
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        try {
          await connectDB();

          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('User not found');
          }

          if (!user.password) {
            throw new Error('Please use OAuth login or reset your password');
          }

          // Compare passwords
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Update last login
          user.lastLogin = new Date();
          await user.save();

          return {
            id: user._id.toString(),
            email: user.email,
            fullName: user.fullName,
            image: user.profileImage,
          };
        } catch (error) {
          console.error('Credentials auth error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),

    // Facebook OAuth
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),

    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    /**
     * JWT callback - runs when JWT is created/updated
     */
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.fullName || user.name;
      }

      // Store OAuth account info in token
      if (account) {
        token.provider = account.provider;
      }

      return token;
    },

    /**
     * Session callback - runs on every session check
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.provider = token.provider;
      }
      return session;
    },

    /**
     * SignIn callback - runs when user signs in
     * Used to create/update user in database for OAuth logins
     */
    async signIn({ user, account, profile, email, credentials }) {
      try {
        await connectDB();

        // For OAuth providers
        if (account?.provider && account.provider !== 'credentials') {
          let existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user from OAuth
            existingUser = new User({
              email: user.email,
              fullName: user.name || profile?.name || '',
              profileImage: user.image || profile?.picture || '',
              oauthProviders: [
                {
                  provider: account.provider,
                  providerId: account.providerAccountId,
                },
              ],
              isVerified: true,
              lastLogin: new Date(),
            });
          } else {
            // Add OAuth provider to existing user
            const providerExists = existingUser.oauthProviders.some(
              (p) => p.provider === account.provider
            );

            if (!providerExists) {
              existingUser.oauthProviders.push({
                provider: account.provider,
                providerId: account.providerAccountId,
              });
            }

            // Update profile info from OAuth
            if (user.name) existingUser.fullName = user.name;
            if (user.image) existingUser.profileImage = user.image;
            existingUser.lastLogin = new Date();
          }

          await existingUser.save();

          // Update user object with database ID
          user.id = existingUser._id.toString();
          user.fullName = existingUser.fullName;
          user.image = existingUser.profileImage;
        }

        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
