import { spawn } from "child_process";
import path from "path";

export async function runEcgPrediction(ecgArray) {
  return new Promise((resolve, reject) => {
    console.log('🐍 Starting Python AI model...');
    
    const scriptPath = path.join(process.cwd(), "app", "aiml", "predict_direct.py");
    // Use the virtual environment Python executable
    const pythonPath = path.join(process.cwd(), ".venv", "Scripts", "python.exe");
    
    console.log('📁 Python script path:', scriptPath);
    console.log('🐍 Python executable:', pythonPath);

    const py = spawn(pythonPath, [scriptPath]);

    let result = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      const output = data.toString();
      console.log('🐍 PYTHON OUTPUT:', output);
      result += output;
    });
    
    py.stderr.on("data", (data) => {
      const error = data.toString();
      console.error('🐍 PYTHON STDERR:', error);
      errorOutput += error;
    });

    py.on("close", (code) => {
      console.log('🐍 Python process closed with code:', code);
      
      if (code !== 0) {
        console.error('❌ Python process failed with exit code:', code);
        console.error('❌ Error output:', errorOutput);
        reject(new Error(`Python process exited with code ${code}: ${errorOutput}`));
        return;
      }
      
      const trimmedResult = result.trim();
      const prediction = parseInt(trimmedResult);
      
      console.log('✅ Python prediction result:', {
        rawOutput: trimmedResult,
        parsedPrediction: prediction,
        isValid: prediction === 0 || prediction === 1
      });
      
      if (isNaN(prediction) || (prediction !== 0 && prediction !== 1)) {
        console.error('❌ Invalid prediction value:', trimmedResult);
        reject(new Error(`Invalid prediction: ${trimmedResult}`));
        return;
      }
      
      resolve(prediction);
    });

    py.on('error', (err) => {
      console.error('❌ Failed to start Python process:', err);
      reject(new Error(`Failed to start Python: ${err.message}`));
    });

    const inputData = JSON.stringify({ ecg: ecgArray });
    console.log('📤 Sending to Python:', {
      dataLength: inputData.length,
      ecgSamples: ecgArray.length
    });
    
    py.stdin.write(inputData);
    py.stdin.end();
  });
}
