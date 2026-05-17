import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    console.log('🗑️ Clearing sensor-data.json...');
    
    const filePath = path.join(process.cwd(), 'sensor-data.json');
    
    // Write empty array to the file
    fs.writeFileSync(filePath, '[]', 'utf-8');
    
    console.log('✅ sensor-data.json cleared successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sensor data cleared successfully' 
    });
  } catch (error) {
    console.error('❌ Error clearing sensor data:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
