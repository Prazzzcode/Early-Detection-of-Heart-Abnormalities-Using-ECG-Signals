// Test MongoDB connection
// Run: node lib/test-connection.js

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables FIRST, before importing mongodb.js
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

// Now import after env vars are loaded
import { connectDB } from './mongodb.js';

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...\n');
    
    const connection = await connectDB();
    
    console.log('\n✅ MongoDB connection successful!\n');
    console.log('Connection details:');
    console.log('  Host:', connection.connection.host);
    console.log('  Database:', connection.connection.name);
    console.log('  State:', connection.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB connection failed!\n');
    console.error('Error details:');
    console.error('  Message:', error.message);
    console.error('\n⚠️  Troubleshooting checklist:');
    console.error('  1. Verify MONGODB_URI in .env.local');
    console.error('  2. Check MongoDB Atlas cluster is running');
    console.error('  3. Confirm IP whitelist includes 0.0.0.0/0 (Allow Access from Anywhere)');
    console.error('  4. Verify database username and password are correct');
    console.error('  5. Ensure database name exists in your cluster');
    console.error('  6. Check your internet connection');
    
    process.exit(1);
  }
}

testConnection();

