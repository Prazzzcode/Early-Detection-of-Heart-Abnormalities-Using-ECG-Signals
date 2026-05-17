# Authentication Setup Guide

## Overview

This application now has a complete authentication system with:

- **Email/Password Authentication** with bcrypt hashing
- **OAuth Support** for Google, Facebook, and GitHub
- **MongoDB Integration** for user data persistence
- **JWT Sessions** for secure authentication
- **NextAuth.js** for session management

---

## Installation

### 1. Install Dependencies

```bash
npm install
```

The following packages have been added:

- `next-auth` - Authentication library
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `@next-auth/mongodb-adapter` - MongoDB adapter

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

---

## Configuration

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and paste it in `.env.local` as `NEXTAUTH_SECRET`

### MongoDB Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and database
3. Copy your connection string and add it to `MONGODB_URI`

Example: `mongodb+srv://username:password@cluster.mongodb.net/heartguard`

### OAuth Setup

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to `.env.local`

#### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Set up Facebook Login product
4. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook` (development)
   - `https://yourdomain.com/api/auth/callback/facebook` (production)
5. Copy App ID and App Secret to `.env.local`

#### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:3000/api/auth/callback/github` (development)
   - `https://yourdomain.com/api/auth/callback/github` (production)
4. Copy Client ID and Client Secret to `.env.local`

---

## File Structure

```
app/
├── api/auth/
│   ├── [...nextauth]/
│   │   └── route.js          # NextAuth configuration with OAuth providers
│   ├── login/
│   │   └── route.js          # Login endpoint
│   └── logout/
│       └── route.js          # Logout endpoint
├── login/
│   └── page.js               # Login page with email/password and OAuth buttons
├── register/
│   └── page.js               # Registration page
└── layout.js                 # Main layout with SessionProvider

lib/
├── auth.js                   # Authentication utilities
├── mongodb.js                # MongoDB connection
└── models/
    └── User.js               # User schema with password and OAuth fields

context/
└── authContext.js            # React context for auth state management
```

---

## Usage

### Sign Up with Email/Password

```javascript
import { signUp } from "@/lib/auth";

const { data, error } = await signUp(
  "user@example.com",
  "securePassword123",
  "John Doe",
);
```

### Sign In with Email/Password

```javascript
import { signIn } from "next-auth/react";

const result = await signIn("credentials", {
  email: "user@example.com",
  password: "securePassword123",
  redirect: false,
});
```

### Sign In with OAuth

```javascript
import { signIn } from "next-auth/react";

// Google
await signIn("google", { callbackUrl: "/" });

// Facebook
await signIn("facebook", { callbackUrl: "/" });

// GitHub
await signIn("github", { callbackUrl: "/" });
```

### Get Current User Session

```javascript
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();

  if (session) {
    console.log(session.user);
  }
}
```

### Logout

```javascript
import { signOut } from "next-auth/react";

await signOut({ callbackUrl: "/login" });
```

---

## User Schema

```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  password: String (bcrypt hashed),
  fullName: String,
  profileImage: String,
  oauthProviders: [
    {
      provider: 'google' | 'facebook' | 'github',
      providerId: String
    }
  ],
  isVerified: Boolean,
  lastLogin: Date,
  // Medical info
  dob: String,
  gender: String,
  phone_no: String,
  address: String,
  medical_conditions: [String],
  current_medications: String,
  allergies: String,
  previous_heart_issues: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Security Features

✅ **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds
✅ **JWT Sessions**: Secure JWT tokens with 30-day expiration
✅ **httpOnly Cookies**: Session cookies are httpOnly and secure
✅ **OAuth Integration**: Supports multiple OAuth providers
✅ **Email Validation**: Basic email format validation
✅ **CSRF Protection**: Built-in NextAuth CSRF protection
✅ **Unique Constraints**: Email uniqueness enforced in database

---

## Routes

### Authentication Routes

- `GET/POST /api/auth/[...nextauth]` - NextAuth handler
- `POST /api/auth/login` - Login with email/password (handled by NextAuth)
- `POST /api/auth/callback/google` - Google OAuth callback
- `POST /api/auth/callback/facebook` - Facebook OAuth callback
- `POST /api/auth/callback/github` - GitHub OAuth callback

### User Routes

- `POST /api/users` - Register new user
- `GET /api/users` - Get all users (admin only)
- `GET /api/auth/me` - Get current user

---

## Troubleshooting

### Issue: "NEXTAUTH_SECRET not configured"

**Solution**: Generate and add `NEXTAUTH_SECRET` to `.env.local`

```bash
openssl rand -base64 32
```

### Issue: OAuth provider not working

**Solution**:

1. Verify callback URIs match exactly in provider settings
2. Check Client ID and Secret are correct
3. Ensure provider is enabled in NextAuth config

### Issue: Password too short error

**Solution**: Passwords must be at least 8 characters long

### Issue: User already exists

**Solution**: Use different email address or reset password

### Issue: Login redirects to login page

**Solution**:

1. Check NEXTAUTH_SECRET is set
2. Clear browser cookies
3. Verify JWT token is valid
4. Check MongoDB connection

---

## Testing

### Create Test User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "fullName": "Test User"
  }'
```

### Login with Test User

```bash
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

---

## Production Checklist

- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Generate new `NEXTAUTH_SECRET`
- [ ] Configure all OAuth providers for production
- [ ] Enable HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Implement rate limiting on auth endpoints
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Monitor authentication logs
- [ ] Implement 2FA (optional)
- [ ] Add CAPTCHA to registration (optional)
- [ ] Regular security audits

---

## Next Steps

1. **Email Verification**: Add email confirmation before login
2. **Password Reset**: Implement forgot password functionality
3. **Two-Factor Authentication**: Add 2FA support
4. **Rate Limiting**: Prevent brute force attacks
5. **Audit Logging**: Log authentication events
6. **Profile Management**: Add user profile update endpoint

---

## Support

For issues or questions, refer to:

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [MongoDB Documentation](https://docs.mongodb.com/)
