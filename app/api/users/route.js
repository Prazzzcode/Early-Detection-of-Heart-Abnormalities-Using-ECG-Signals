import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

/**
 * POST /api/users
 * Register a new user with email and password
 */
export async function POST(request) {
  try {
    await connectDB();
    const { email, password, fullName } = await request.json();

    // Validation
    if (!email || !password || !fullName) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and full name are required' }),
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters long' }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists with this email' }),
        { status: 400 }
      );
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      isVerified: true, // Auto-verify email/password registrations
      lastLogin: new Date(),
    });

    await user.save();

    // Return user without password
    return new Response(
      JSON.stringify({
        _id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        message: 'User registered successfully',
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to register user' }),
      { status: 500 }
    );
  }
}

/**
 * GET /api/users
 * Get all users (admin only - should be protected in production)
 */
export async function GET(request) {
  try {
    await connectDB();
    const users = await User.find({}).select('-password');

    return new Response(
      JSON.stringify(users),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
