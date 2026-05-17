"use client";

import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';

export function ECGMedicalPaper({ sampleData, sampleRate = 1000 }) {
  const canvasRef = useRef(null);
  const [ecgData, setEcgData] = useState([]);

  // Simple moving average filter to smooth ECG data
  const smoothData = (data, windowSize = 5) => {
    const smoothed = [];
    for (let i = 0; i < data.length; i++) {
      let sum = 0;
      let count = 0;
      const halfWindow = Math.floor(windowSize / 2);
      
      for (let j = Math.max(0, i - halfWindow); j <= Math.min(data.length - 1, i + halfWindow); j++) {
        sum += data[j];
        count++;
      }
      smoothed.push(sum / count);
    }
    return smoothed;
  };

  useEffect(() => {
    // Load and process ECG data
    if (sampleData && Array.isArray(sampleData) && sampleData.length > 0) {
      const allSamples = [];
      sampleData.forEach(entry => {
        if (entry.data && Array.isArray(entry.data)) {
          allSamples.push(...entry.data);
        }
      });
      console.log('ECG Data loaded:', allSamples.length, 'samples');
      console.log('Sample range:', Math.min(...allSamples), 'to', Math.max(...allSamples));
      
      // Apply smoothing filter to reduce noise
      const smoothedData = smoothData(allSamples, 3); // Small window to preserve peaks
      setEcgData(smoothedData);
    } else {
      console.log('No sample data available:', sampleData);
      // Clear the graph when no data is coming
      setEcgData([]);
    }
  }, [sampleData]);

  useEffect(() => {
    if (!ecgData.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const width = canvas.width;
    const height = canvas.height;

    // Pick a clean 1-2 second segment - adjust based on available data
    const dataLength = ecgData.length;
    let zoomStart = 0;
    let zoomEnd = Math.min(1000, dataLength); // Show first 1 second or all available data
    
    // If we have enough data, pick a segment from the middle
    if (dataLength > 3500) {
      zoomStart = 2500;
      zoomEnd = 3500;
    } else if (dataLength > 1000) {
      // Use middle portion
      zoomStart = Math.floor(dataLength * 0.3);
      zoomEnd = Math.min(zoomStart + 1000, dataLength);
    }
    
    const ecgZoom = ecgData.slice(zoomStart, zoomEnd);
    
    if (ecgZoom.length === 0) {
      // Show error message on canvas
      ctx.fillStyle = '#ffe6e6';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No ECG data available', width / 2, height / 2);
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // --- Pink background (ECG paper style) ---
    ctx.fillStyle = '#ffe6e6';
    ctx.fillRect(0, 0, width, height);

    // Calculate amplitude statistics for better normalization
    const minAmp = Math.min(...ecgZoom);
    const maxAmp = Math.max(...ecgZoom);
    const range = maxAmp - minAmp;
    
    // Add padding to prevent waveform from touching edges (20% padding on top/bottom)
    const padding = 0.2;
    const paddedHeight = height * (1 - 2 * padding);
    const yOffset = height * padding;

    // Calculate time array
    const timeZoom = ecgZoom.map((_, i) => i / sampleRate);
    const maxTime = timeZoom[timeZoom.length - 1];

    // --- Light grid (1 mm style) - minor grid ---
    ctx.strokeStyle = '#ffcccc';
    ctx.lineWidth = 0.6;

    // Vertical minor grid lines (0.04 sec intervals)
    const minorTimeInterval = 0.04;
    for (let t = 0; t <= maxTime; t += minorTimeInterval) {
      const x = (t / maxTime) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal minor grid lines
    const minorGridSpacing = height / 20; // 20 minor divisions
    for (let i = 0; i <= 20; i++) {
      const y = i * minorGridSpacing;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // --- Dark bold grid (5 mm style) - major grid ---
    ctx.strokeStyle = '#ff9999';
    ctx.lineWidth = 1.2;

    // Vertical major grid lines (0.2 sec intervals, 5x minor)
    const majorTimeInterval = 0.2;
    for (let t = 0; t <= maxTime; t += majorTimeInterval) {
      const x = (t / maxTime) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal major grid lines (every 5 minor divisions)
    const majorGridSpacing = height / 4; // 4 major divisions
    for (let i = 0; i <= 4; i++) {
      const y = i * majorGridSpacing;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // --- ECG waveform with smooth rendering ---
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Enable anti-aliasing for smoother lines
    ctx.imageSmoothingEnabled = true;
    
    ctx.beginPath();

    ecgZoom.forEach((value, index) => {
      const x = (timeZoom[index] / maxTime) * width;
      // Normalize and flip Y axis (canvas Y increases downward)
      const normalizedY = (value - minAmp) / range;
      const y = height - yOffset - (normalizedY * paddedHeight);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // --- Labels ---
    ctx.fillStyle = 'black';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('ECG Lead', 20, 25);
    
    ctx.font = '12px Arial';
    ctx.fillText(`Time: 0 - ${maxTime.toFixed(2)} sec`, 20, height - 15);
    ctx.fillText(`Range: ${minAmp.toFixed(0)} - ${maxAmp.toFixed(0)}`, width - 150, height - 15);

  }, [ecgData, sampleRate]);

  const downloadGraph = () => {
    if (!canvasRef.current) return;
    
    // Create download link
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `ECG_Graph_${timestamp}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">ECG </h3>
        <button
          onClick={downloadGraph}
          disabled={ecgData.length === 0}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Download className="h-4 w-4" />
          <span>Download Graph</span>
        </button>
      </div>
      {ecgData.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>Loading ECG data... ({sampleData?.length || 0} entries received)</p>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        width={1200} 
        height={400}
        className="w-full h-auto border border-gray-300 rounded"
        style={{ display: ecgData.length === 0 ? 'none' : 'block' }}
      />
    </div>
  );
}
