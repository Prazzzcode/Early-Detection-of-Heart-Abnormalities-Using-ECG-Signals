import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';

/**
 * GET /api/auth/me
 * Get current user from session
 */
export async function GET(request) {
  try {
    await connectDB();

    // Get sessionId from cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionId = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('sessionId='))
      ?.split('=')[1];

    if (!sessionId) {
      return Response.json(
        { error: { message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    // Find user by session (in production, validate JWT token)
    const user = await User.findById(sessionId).select('-password');

    if (!user) {
      return Response.json(
        { error: { message: 'User not found' } },
        { status: 401 }
      );
    }

    return Response.json(
      {
        user: {
          _id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return Response.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
