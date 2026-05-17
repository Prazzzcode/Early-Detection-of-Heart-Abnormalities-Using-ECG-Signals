import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';

/**
 * POST /api/auth/login
 * Login user with email and password
 */
export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: { message: 'Email and password required' } },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { error: { message: 'User not found' } },
        { status: 401 }
      );
    }

    // For demo: simple password check (use bcrypt in production)
    // const isValid = await bcrypt.compare(password, user.password);
    // For now: direct comparison (NOT FOR PRODUCTION)
    if (password !== 'password123') {
      // placeholder
      return Response.json(
        { error: { message: 'Invalid password' } },
        { status: 401 }
      );
    }

    // Return user (don't send password)
    const userData = {
      _id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    };

    // Set httpOnly cookie (more secure than localStorage)
    const response = Response.json(
      { user: userData, token: 'optional-jwt-token' },
      { status: 200 }
    );

    response.headers.set(
      'Set-Cookie',
      `sessionId=${user._id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
