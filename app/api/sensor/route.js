import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import { spawn } from "child_process";
import path from "path";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Path to the JSON file where sensor data will be stored
const DATA_FILE_PATH = join(process.cwd(), 'sensor-data.json');

// Function to ensure the data file exists
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE_PATH);
    // Validate the file content
    const content = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    if (!content || content.trim() === '') {
      console.log('📁 File is empty, initializing with []');
      await fs.writeFile(DATA_FILE_PATH, '[]');
    } else {
      // Try to parse to validate JSON
      try {
        JSON.parse(content);
      } catch (parseError) {
        console.log('⚠️ Corrupted JSON file detected, resetting to []');
        await fs.writeFile(DATA_FILE_PATH, '[]');
      }
    }
  } catch (error) {
    // File doesn't exist, create it with an empty array (compact format)
    await fs.writeFile(DATA_FILE_PATH, '[]');
    console.log('📁 Created new sensor data file');
  }
}

// Function to read existing data
async function readSensorData() {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    if (!fileContent || fileContent.trim() === '') {
      console.log('⚠️ Empty file, returning empty array');
      return [];
    }
    const parsed = JSON.parse(fileContent);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading sensor data:', error.message);
    // Reset the file if it's corrupted
    try {
      await fs.writeFile(DATA_FILE_PATH, '[]');
      console.log('🔄 Reset corrupted file to []');
    } catch (writeError) {
      console.error('Error resetting file:', writeError.message);
    }
    return [];
  }
}

// Function to write data to file (compact format)
async function writeSensorData(data) {
  try {
    // Use compact JSON format (no indentation) to keep arrays on single lines
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing sensor data:', error);
    throw error;
  }
}

// POST endpoint to receive ECG sensor data
export async function POST(request) {
    console.log('🚀 Incoming ECG data POST request received');
  try {
    // Parse the incoming JSON data
    const ecgData = await request.json();
    
    // Validate ECG data format
    if (!ecgData.data || !Array.isArray(ecgData.data)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid data format. Expected: {"data": [array of numbers]}'
      }, { status: 400 });
    }
    
    // Add metadata to the ECG data
    const timestampedData = {
      data: ecgData.data,
      timestamp: new Date().toISOString(),
      id: Date.now(),
      sampleCount: ecgData.data.length,
      sampleRate: 1000, // Assuming 1000 Hz sample rate for 100 samples per 100ms
      deviceType: 'ECG_Sensor',
      // Calculate basic statistics for quick reference
      stats: {
        min: Math.min(...ecgData.data),
        max: Math.max(...ecgData.data),
        avg: (ecgData.data.reduce((a, b) => a + b, 0) / ecgData.data.length).toFixed(2),
        range: Math.max(...ecgData.data) - Math.min(...ecgData.data)
      }
    };

    

    // Log to console in real-time with ECG-specific formatting
    console.log('❤️  REAL-TIME ECG DATA RECEIVED:');
    console.log(`📊 Timestamp: ${timestampedData.timestamp}`);
    console.log(`🔢 Sample Count: ${timestampedData.sampleCount}`);
    console.log(`📈 Min/Max/Avg: ${timestampedData.stats.min}/${timestampedData.stats.max}/${timestampedData.stats.avg}`);
    console.log(`📋 Data Preview: [${ecgData.data.slice(0, 5).join(', ')}, ..., ${ecgData.data.slice(-5).join(', ')}]`);
    
    // Ensure the data file exists
    await ensureDataFile();
    
    // Read existing data
    const existingData = await readSensorData();
    
    // Add new data to the beginning of the array (most recent first)
    existingData.unshift(timestampedData);
    
    // Keep only the last 500 readings for ECG data (since each has 100 values)
    const trimmedData = existingData.slice(0, 500);
    
    // Write updated data back to file (compact format)
    await writeSensorData(trimmedData);
    
    // Log success with ECG-specific info
    console.log(`✅ ECG data saved! Total readings: ${trimmedData.length} | Latest sample count: ${timestampedData.sampleCount}`);
    console.log('─'.repeat(80));
    
    return NextResponse.json({
      success: true,
      message: 'ECG data received and saved',
      dataCount: trimmedData.length,
      receivedAt: timestampedData.timestamp,
      sampleCount: timestampedData.sampleCount,
      stats: timestampedData.stats
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error processing ECG data:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process ECG data',
      details: error.message
    }, { status: 500 });
  }
}

// GET endpoint to retrieve ECG sensor data
export async function GET(request) {
  try {
    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20'); // Reduced default for ECG data
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeRawData = searchParams.get('includeRaw') === 'true';
    
    // Ensure the data file exists
    await ensureDataFile();
    
    // Read ECG data
    const allData = await readSensorData();
    
    // Apply pagination
    let paginatedData = allData.slice(offset, offset + limit);
    
    // Option to exclude raw data for performance (send only metadata)
    if (!includeRawData) {
      paginatedData = paginatedData.map(reading => {
        const { data, ...metadata } = reading;
        return {
          ...metadata,
          dataLength: data ? data.length : 0,
          dataPreview: data ? `[${data.slice(0, 3).join(', ')}, ..., ${data.slice(-3).join(', ')}]` : null
        };
      });
    }
    
    console.log(`📊 ECG data requested - Limit: ${limit}, Offset: ${offset}, Total: ${allData.length}, Include Raw: ${includeRawData}`);
    
    return NextResponse.json({
      success: true,
      data: paginatedData,
      total: allData.length,
      limit,
      offset,
      includeRawData
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error retrieving ECG data:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve ECG data',
      details: error.message
    }, { status: 500 });
  }
}

// DELETE endpoint to clear all ECG sensor data
export async function DELETE() {
  try {
    await fs.writeFile(DATA_FILE_PATH, '[]');
    console.log('🗑️ All ECG sensor data cleared');
    
    return NextResponse.json({
      success: true,
      message: 'All ECG sensor data cleared'
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error clearing ECG sensor data:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to clear ECG sensor data',
      details: error.message
    }, { status: 500 });
  }
}


