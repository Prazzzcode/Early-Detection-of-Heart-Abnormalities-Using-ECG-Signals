import mongoose from 'mongoose';

/**
 * Global cache object stored in Node.js global scope.
 * This survives module reloads in development and persists across invocations in serverless.
 * Key: 'mongooseCache', Value: { conn: null, promise: null, disconnected: false }
 */
function getGlobalCache() {
  if (!global.mongooseCache) {
    global.mongooseCache = {
      conn: null,
      promise: null,
      disconnected: false,
      timestamp: null,
    };
  }
  return global.mongooseCache;
}

/**
 * Connects to MongoDB with built-in caching for development and serverless.
 * Handles:
 * - Hot reload in development
 * - Connection pooling in production
 * - Graceful disconnection in serverless
 */
export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI environment variable is not defined.\n' +
      'Please add it to .env.local:\n' +
      'MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database'
    );
  }

  const cache = getGlobalCache();
  const isDev = process.env.NODE_ENV === 'development';

  try {
    // If already connected and not stale, return cached connection
    if (cache.conn && !cache.disconnected) {
      const now = Date.now();
      const cacheAge = now - (cache.timestamp || now);
      
      // Log cache hits less frequently to reduce noise
      if (cacheAge % 5000 < 1000) {
        console.log(`[MongoDB] ♻️  Using cached connection (age: ${cacheAge}ms)`);
      }
      return cache.conn;
    }

    // Clear stale connection
    if (cache.disconnected) {
      console.log('[MongoDB] 🔄 Reconnecting after disconnection...');
      cache.conn = null;
      cache.promise = null;
      cache.disconnected = false;
    }

    // If connection is already in progress, wait for it
    if (cache.promise) {
      console.log('[MongoDB] ⏳ Waiting for in-progress connection...');
      return await cache.promise;
    }

    // Initiate new connection
    console.log('[MongoDB] 🌍 Initiating new MongoDB connection...');
    
    const connectPromise = mongoose.connect(MONGODB_URI, {
      // Connection options
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      
      // Connection pooling
      maxPoolSize: 10,
      minPoolSize: isDev ? 2 : 5,
      
      // Reliability
      retryWrites: true,
      w: 'majority',
      journal: true,
      
      // For serverless/AWS Lambda
      family: 4, // Use IPv4
    });

    // Store promise to avoid duplicate connections during initial connection
    cache.promise = connectPromise;

    // Wait for connection to establish
    const connection = await connectPromise;
    
    // Cache the successful connection
    cache.conn = connection;
    cache.timestamp = Date.now();
    cache.promise = null; // Clear the promise after success
    
    console.log(
      `[MongoDB] ✅ Connected successfully\n` +
      `           Host: ${connection.connection.host}\n` +
      `           Database: ${connection.connection.name}\n` +
      `           State: ${connection.connection.readyState === 1 ? 'Connected' : 'Connecting'}`
    );

    // Handle connection events
    connection.connection.on('disconnected', () => {
      console.log('[MongoDB] ⚠️  Connection disconnected');
      cache.disconnected = true;
    });

    connection.connection.on('reconnected', () => {
      console.log('[MongoDB] 🔗 Connection restored');
      cache.disconnected = false;
      cache.timestamp = Date.now();
    });

    return connection;
  } catch (error) {
    // Clear failed promise to allow retry
    cache.promise = null;
    cache.conn = null;
    
    console.error(
      `[MongoDB] ❌ Connection failed\n` +
      `           Error: ${error.message}\n` +
      `           Code: ${error.code}`
    );

    // Provide helpful debugging info
    if (error.message.includes('connect')) {
      console.error('[MongoDB] 💡 Debugging tips:');
      console.error('           1. Verify MONGODB_URI in .env.local');
      console.error('           2. Check MongoDB Atlas cluster status');
      console.error('           3. Confirm IP whitelist (0.0.0.0/0 for development)');
      console.error('           4. Verify credentials and database name');
    }

    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}

/**
 * Gracefully disconnect from MongoDB.
 * Use this in serverless environments before function exit.
 */
export async function disconnectDB() {
  const cache = getGlobalCache();

  if (cache.conn) {
    try {
      await mongoose.disconnect();
      cache.conn = null;
      cache.disconnected = true;
      cache.timestamp = null;
      console.log('[MongoDB] 🔌 Disconnected successfully');
    } catch (error) {
      console.error('[MongoDB] Error disconnecting:', error.message);
    }
  }
}

/**
 * Get connection status for health checks
 */
export function getConnectionStatus() {
  const cache = getGlobalCache();
  const MONGODB_URI = process.env.MONGODB_URI || '';
  
  return {
    connected: cache.conn !== null && !cache.disconnected,
    state: cache.conn?.connection?.readyState || 0,
    timestamp: cache.timestamp,
    uri: MONGODB_URI ? MONGODB_URI.replace(/:[^:]*@/, ':***@') : 'not-set', // Mask password
  };
}
