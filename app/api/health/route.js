import { connectDB, getConnectionStatus } from '@/lib/mongodb';

/**
 * Health check endpoint
 * GET /api/health
 * 
 * Returns:
 * - 200 if MongoDB is connected
 * - 503 if MongoDB is not connected
 */
export async function GET() {
  try {
    // Attempt connection
    await connectDB();

    const status = getConnectionStatus();

    return Response.json(
      {
        status: 'healthy',
        database: status,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Health Check] MongoDB check failed:', error.message);

    return Response.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
