import { NextResponse } from "next/server";
import { runEcgPrediction } from "../../aiml/predict.js";

export async function POST(req) {
  console.log('========== AI PREDICTION API CALLED ==========');
  
  try {
    const { ecg } = await req.json();

    console.log('📊 ECG Data received:', {
      length: ecg?.length,
      hasData: !!ecg,
      firstFewValues: ecg?.slice(0, 5),
      lastFewValues: ecg?.slice(-5)
    });

    if (!ecg || ecg.length !== 200) {
      console.error('❌ Invalid ECG data length:', ecg?.length, '(expected 200)');
      return NextResponse.json({ 
        error: `Send exactly 200 values. Received: ${ecg?.length || 0}`,
        success: false 
      }, { status: 400 });
    }

    console.log('🤖 Running AI prediction...');
    const startTime = Date.now();
    
    const result = await runEcgPrediction(ecg);
    
    const duration = Date.now() - startTime;
    console.log('✅ AI Prediction completed:', {
      result: result,
      interpretation: result === 0 ? 'HEALTHY' : result === 1 ? 'UNHEALTHY' : 'UNKNOWN',
      durationMs: duration
    });

    return NextResponse.json({ 
      prediction: result,
      success: true,
      isHealthy: result === 0,
      status: result === 0 ? 'Healthy' : 'Unhealthy'
    });
    
  } catch (error) {
    console.error('❌ AI PREDICTION ERROR:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      error: error.message,
      success: false,
      prediction: null
    }, { status: 500 });
  }
}
