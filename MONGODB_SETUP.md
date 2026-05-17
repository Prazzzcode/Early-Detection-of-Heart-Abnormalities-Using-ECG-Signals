# MongoDB Connection Architecture

## Overview

This document explains the production-grade MongoDB connection setup and how it handles:

- **Development hot reload** without creating multiple connections
- **Serverless environments** (AWS Lambda, Vercel, etc.)
- **Connection pooling and caching**
- **Graceful error recovery**

---

## Architecture

### Problem: Connection Caching in Next.js Dev Mode

**The Issue:**

- Next.js hot reload re-executes modules
- Traditional local cache variables get recreated
- This caused multiple MongoDB connections in dev mode
- Logs showed repeated "cached connection" messages but connections were multiplying

**The Solution:**

```javascript
// ❌ BROKEN: Local reference gets recreated on hot reload
let cached = global.mongoose || { conn: null, promise: null };

// ✅ FIXED: Always reference global object directly
function getGlobalCache() {
  if (!global.mongooseCache) {
    global.mongooseCache = { conn: null, promise: null, disconnected: false };
  }
  return global.mongooseCache;
}
```

### Key Improvements

| Feature                    | Before               | After                       |
| -------------------------- | -------------------- | --------------------------- |
| **Dev Hot Reload**         | Multiple connections | Single cached connection    |
| **Cache Reference**        | Local var (broken)   | Direct global reference     |
| **Disconnection Tracking** | Not tracked          | Automatic reconnection      |
| **Rapid Requests**         | Race conditions      | Promise-based deduplication |
| **Serverless Support**     | Limited              | Full support                |
| **Logging**                | Verbose              | Intelligent (context-aware) |

---

## Usage

### Basic Connection

```javascript
import { connectDB } from "@/lib/mongodb";

export async function GET(req) {
  try {
    await connectDB(); // Automatically cached on subsequent calls
    const users = await User.find({});
    return Response.json(users);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### Health Check Endpoint

Access `http://localhost:3000/api/health` to verify MongoDB connection.

```javascript
// Returns status and connection info
{
  "status": "healthy",
  "database": {
    "connected": true,
    "state": 1,
    "uri": "mongodb+srv://user:***@cluster.mongodb.net/db"
  }
}
```

### Connection Status

```javascript
import { getConnectionStatus } from "@/lib/mongodb";

const status = getConnectionStatus();
console.log(status);
// {
//   connected: true,
//   state: 1,
//   timestamp: 1777704916331,
//   uri: 'mongodb+srv://...'
// }
```

### Serverless Cleanup

For Lambda/Edge functions, disconnect before exit:

```javascript
import { connectDB, disconnectDB } from "@/lib/mongodb";

export async function handler(event, context) {
  // Keep function alive until callback is invoked
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();
    // ... your code ...
  } finally {
    await disconnectDB();
  }
}
```

---

## Connection Options Explained

```javascript
{
  bufferCommands: false,           // Fail fast if not connected
  serverSelectionTimeoutMS: 5000,  // 5sec to find server
  socketTimeoutMS: 45000,          // 45sec socket timeout
  maxPoolSize: 10,                 // Max connections
  minPoolSize: isDev ? 2 : 5,      // Min connections
  retryWrites: true,               // Automatic retry
  w: 'majority',                   // Write concern
  journal: true,                   // Enable journaling
  family: 4,                       // IPv4 (for Lambda)
}
```

---

## Development

### Testing Connection

```bash
# Run comprehensive test suite
node lib/test-connection.mjs
```

**Tests:**

1. ✅ Initial connection
2. ✅ Cached connection reuse
3. ✅ Connection status retrieval
4. ✅ Multiple rapid requests (deduplicated)
5. ✅ Graceful disconnection
6. ✅ Reconnection after disconnect

### Monitoring in Development

Watch console logs for connection events:

```
[MongoDB] 🌍 Initiating new MongoDB connection...
[MongoDB] ✅ Connected successfully
[MongoDB] ♻️  Using cached connection (age: 22ms)
[MongoDB] ⚠️  Connection disconnected
[MongoDB] 🔗 Connection restored
[MongoDB] 🔌 Disconnected successfully
```

---

## Production Deployment

### Environment Variables

Set `MONGODB_URI` in your production environment:

```bash
# Vercel
vercel env add MONGODB_URI

# AWS Lambda
aws lambda update-function-configuration \
  --function-name my-function \
  --environment Variables={MONGODB_URI=mongodb+srv://...}
```

### Monitoring

Use the health check endpoint for monitoring:

```bash
# Health check
curl https://yourapp.com/api/health

# Expected response (healthy)
{
  "status": "healthy",
  "database": { "connected": true, ... }
}

# Expected response (unhealthy - 503)
{
  "status": "unhealthy",
  "error": "connection refused"
}
```

### Connection Pool Sizing

- **Development**: 2 minimum connections (to avoid resource waste)
- **Production**: 5-10 minimum connections (for request concurrency)
- **Serverless**: Each Lambda execution gets its own pool (temporary)

---

## Troubleshooting

### "MONGODB_URI is not defined"

```bash
# Ensure .env.local exists with:
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
```

### "Connection timeout"

1. Check MongoDB Atlas cluster is running
2. Verify IP whitelist includes `0.0.0.0/0` (or your IP)
3. Confirm database user credentials are correct
4. Check internet connectivity

### "Too many connections"

- This is now prevented by the new caching system
- Old behavior (multiple connections) is fixed
- Each process maintains one connection pool

### Multiple "cached connection" logs

This is **expected and correct**. It means:

- ✅ Connection is working
- ✅ Subsequent requests reuse the same connection
- ✅ No new connections are being created

To reduce log verbosity, modify the logging logic in `lib/mongodb.js`.

---

## API Reference

### `connectDB()`

Connects to MongoDB with automatic caching.

```javascript
const connection = await connectDB();
// connection: mongoose connection object
```

**Features:**

- Automatic connection reuse
- Promise-based deduplication (multiple calls share one promise)
- Automatic reconnection on disconnection
- Dev hot-reload safe

### `disconnectDB()`

Gracefully closes the MongoDB connection.

```javascript
await disconnectDB();
// For serverless cleanup
```

### `getConnectionStatus()`

Returns current connection status.

```javascript
const status = getConnectionStatus();
// {
//   connected: boolean,
//   state: 0-2 (disconnected, connecting, connected),
//   timestamp: number,
//   uri: string (with masked password)
// }
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│          Next.js Application                         │
├─────────────────────────────────────────────────────┤
│  API Routes                                          │
│  ├─ /api/users/route.js                             │
│  ├─ /api/users/[id]/route.js                        │
│  └─ /api/health/route.js                            │
└────────────────┬────────────────────────────────────┘
                 │
                 │ await connectDB()
                 │
         ┌───────▼────────────┐
         │  lib/mongodb.js    │
         │  connectDB()       │
         │  disconnectDB()    │
         │  getConnectionStatus()
         └───────┬────────────┘
                 │
         ┌───────▼────────────────────────┐
         │  global.mongooseCache          │
         │  ├─ conn (mongoose instance)   │
         │  ├─ promise (pending connect)  │
         │  ├─ disconnected (boolean)     │
         │  └─ timestamp (connection time)│
         └───────┬────────────────────────┘
                 │
         ┌───────▼────────────────────────┐
         │  MongoDB Atlas                 │
         │  myDatabase                    │
         │  ├─ users                      │
         │  └─ (other collections)        │
         └────────────────────────────────┘
```

---

## Performance Notes

### Connection Reuse

- First request: 50-200ms (new connection)
- Subsequent requests: <1ms (cached connection)
- No connection overhead after warmup

### Memory Usage

- Connection pool: ~10-20MB per process
- Development: Minimal (2 min connections)
- Production: Scales with traffic

### Serverless Considerations

- Each Lambda execution gets a fresh process
- Connection pools do NOT persist across invocations
- Use connection pooling within single request to reduce overhead
- Consider connection lifecycle in long-running functions

---

## Related Files

- `lib/mongodb.js` - Main connection logic
- `lib/models/User.js` - MongoDB schema example
- `app/api/health/route.js` - Health check endpoint
- `.env.local` - Environment configuration
- `lib/test-connection.mjs` - Test suite
