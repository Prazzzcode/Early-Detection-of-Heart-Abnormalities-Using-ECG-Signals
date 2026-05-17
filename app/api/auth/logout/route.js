/**
 * POST /api/auth/logout
 * Logout user and clear session
 */
export async function POST(request) {
  try {
    // Clear session cookie
    const response = Response.json(
      { success: true },
      { status: 200 }
    );

    response.headers.set(
      'Set-Cookie',
      'sessionId=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
    );

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
