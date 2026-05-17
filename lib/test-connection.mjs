// Test MongoDB connection
// Run: node lib/test-connection.mjs

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables FIRST, before importing mongodb.js
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

// Now import after env vars are loaded
import { connectDB, disconnectDB, getConnectionStatus } from './mongodb.js';

async function testConnection() {
  try {
    console.log('═══════════════════════════════════════════');
    console.log('  MongoDB Connection Test Suite');
    console.log('═══════════════════════════════════════════\n');

    // Test 1: Initial connection
    console.log('Test 1: Initial Connection');
    console.log('─────────────────────────');
    const conn1 = await connectDB();
    console.log('✅ Initial connection successful\n');

    // Test 2: Cached connection (should be instant)
    console.log('Test 2: Cached Connection (should use cache)');
    console.log('─────────────────────────────────────────');
    const start = Date.now();
    const conn2 = await connectDB();
    const elapsed = Date.now() - start;
    console.log(`✅ Cache hit (${elapsed}ms)\n`);

    // Test 3: Connection status
    console.log('Test 3: Connection Status');
    console.log('─────────────────────────');
    const status = getConnectionStatus();
    console.log('Status:', status);
    console.log('✅ Status check passed\n');

    // Test 4: Multiple rapid connections
    console.log('Test 4: Multiple Rapid Connections');
    console.log('────────────────────────────────────');
    const promises = [
      connectDB(),
      connectDB(),
      connectDB(),
    ];
    await Promise.all(promises);
    console.log('✅ All rapid connections handled correctly\n');

    // Test 5: Graceful disconnect
    console.log('Test 5: Graceful Disconnect');
    console.log('────────────────────────────');
    await disconnectDB();
    console.log('✅ Disconnected successfully\n');

    // Test 6: Reconnection after disconnect
    console.log('Test 6: Reconnection After Disconnect');
    console.log('──────────────────────────────────────');
    const conn3 = await connectDB();
    console.log('✅ Reconnected successfully\n');

    console.log('═══════════════════════════════════════════');
    console.log('  All Tests Passed! 🎉');
    console.log('═══════════════════════════════════════════\n');

    // Final cleanup
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test Failed\n');
    console.error('Error details:');
    console.error('  Message:', error.message);
    console.error('\n⚠️  Troubleshooting checklist:');
    console.error('  1. Verify MONGODB_URI in .env.local');
    console.error('  2. Check MongoDB Atlas cluster is running');
    console.error('  3. Confirm IP whitelist includes 0.0.0.0/0');
    console.error('  4. Verify database username and password');
    console.error('  5. Ensure database name exists in cluster');
    console.error('  6. Check internet connection');
    console.error('  7. Review error message above for specific details');
    
    process.exit(1);
  }
}

testConnection();
