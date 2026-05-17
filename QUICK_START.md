# Quick Start: Authentication Setup

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Copy Environment File
```bash
cp .env.local.example .env.local
```

### Step 3: Set Required Variables

Edit `.env.local` and set these variables:

**MongoDB:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heartguard
```

**NextAuth Secret:**
```bash
# Generate with:
openssl rand -base64 32
# Then paste the output in .env.local:
NEXTAUTH_SECRET=your-generated-secret-here
```

**URLs:**
```
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 4: (Optional) Set Up OAuth

Add OAuth credentials from Google, Facebook, and/or GitHub:
```
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
FACEBOOK_CLIENT_ID=xxx
FACEBOOK_CLIENT_SECRET=xxx
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
```

### Step 5: Start the App
```bash
npm run dev
```

Visit `http://localhost:3000/login` to test!

---

## Test the Auth System

### Create a Test Account
1. Go to `/register`
2. Enter:
   - Full Name: Test User
   - Email: test@example.com
   - Password: TestPassword123 (min 8 chars)
3. Click Sign Up
4. You'll be redirected to login page

### Log In
1. Go to `/login`
2. Enter:
   - Email: test@example.com
   - Password: TestPassword123
3. Click Sign In
4. You should be logged in!

### Test OAuth (Optional)
1. Go to `/login`
2. Click "Continue with Google" (or Facebook/GitHub)
3. Authorize the application
4. You'll be logged in automatically!

---

## Database Check

After creating a user, verify it in MongoDB Atlas:

1. Go to MongoDB Atlas
2. Browse Collections
3. Look for `users` collection
4. You should see your user with:
   - Hashed password
   - Full name
   - Email
   - lastLogin timestamp

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| `NEXTAUTH_SECRET not configured` | Run `openssl rand -base64 32` and add to `.env.local` |
| `MongoDB connection failed` | Check `MONGODB_URI` in `.env.local` |
| `OAuth login not working` | Verify Client ID/Secret and redirect URLs |
| `Password too short` | Passwords must be at least 8 characters |
| `User already exists` | Use different email or delete from DB |

---

## File Locations

- **Login Page**: `app/login/page.js`
- **Register Page**: `app/register/page.js`
- **Auth Config**: `app/api/auth/[...nextauth]/route.js`
- **User Model**: `lib/models/User.js`
- **Auth Utils**: `lib/auth.js`
- **Full Docs**: `AUTHENTICATION.md`

---

## What's Included?

✅ Email/Password login
✅ Secure password hashing
✅ Google OAuth
✅ Facebook OAuth
✅ GitHub OAuth
✅ Session management
✅ Protected routes
✅ User database storage

---

## Next: Configure Your OAuth Providers

### Google
1. https://console.cloud.google.com/
2. Create new project
3. Enable Google+ API
4. OAuth 2.0 Client ID → Web application
5. Add redirect: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID & Secret

### Facebook
1. https://developers.facebook.com/
2. Create app
3. Add Facebook Login product
4. Get App ID & Secret
5. Add redirect: `http://localhost:3000/api/auth/callback/facebook`

### GitHub
1. GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App
3. Authorization callback: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID & Secret

---

## Security Notes

⚠️ **Never commit `.env.local` to git** - Add to `.gitignore`

⚠️ **Passwords are hashed** - Users can't be retrieved by password

⚠️ **Sessions expire in 30 days** - Users need to re-login

⚠️ **Use HTTPS in production** - Never use HTTP for authentication

⚠️ **Rotate OAuth secrets regularly** - For security compliance

---

## Common Questions

**Q: Can I use this for production?**
A: Yes! See AUTHENTICATION.md → Production Checklist

**Q: How do I add email verification?**
A: See AUTHENTICATION.md → Next Steps

**Q: How do I implement password reset?**
A: See AUTHENTICATION.md → Next Steps

**Q: Can I use multiple auth methods?**
A: Yes! Email/OAuth can be linked to same user

**Q: Where are sessions stored?**
A: In encrypted httpOnly cookies + MongoDB (via NextAuth)

---

**👉 Start here**: Go to `/register` and create an account!
