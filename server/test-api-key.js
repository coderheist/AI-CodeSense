import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const testGeminiAPI = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('\n🔍 Testing Gemini API...\n');
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT FOUND');
  console.log('API Key Length:', apiKey ? apiKey.length : 0);
  console.log('Starts with AIza:', apiKey ? apiKey.startsWith('AIza') : false);
  
  if (!apiKey) {
    console.error('❌ No API key found in .env file');
    process.exit(1);
  }

  try {
    console.log('\n📡 Attempting to connect to Gemini API...\n');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // First, try to list available models
    console.log('📋 Fetching list of available models...\n');
    
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
      const data = await response.json();
      
      if (data.models) {
        console.log('✅ Available models:');
        data.models.forEach(model => {
          console.log(`  - ${model.name.replace('models/', '')}`);
        });
        console.log('');
      } else {
        console.log('⚠️  Could not list models. Response:', data);
      }
    } catch (listErr) {
      console.log('⚠️  Could not list models:', listErr.message);
    }
    
    // Try different model names
    const modelsToTry = [
      'gemini-2.0-flash',
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-pro-latest'
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = 'Say "Hello, World!" in exactly 2 words.';
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`\n✅ SUCCESS! Model "${modelName}" works!\n`);
        console.log('Response:', text);
        console.log(`\n🎉 Use this model name in your code: ${modelName}\n`);
        process.exit(0);
      } catch (err) {
        console.log(`❌ Model "${modelName}" failed:`, err.status, err.statusText);
      }
    }
    
  } catch (error) {
    console.error('\n❌ ERROR: API Key is INVALID or API not enabled\n');
    console.error('Error Type:', error.constructor.name);
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    
    if (error.status === 400) {
      console.error('\n📋 Steps to fix:');
      console.error('1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
      console.error('2. Make sure Generative Language API is ENABLED');
      console.error('3. Go to: https://aistudio.google.com/app/apikey');
      console.error('4. Create a NEW API key');
      console.error('5. Update GEMINI_API_KEY in .env file');
      console.error('6. Make sure there are NO spaces or quotes around the key');
    }
    
    process.exit(1);
  }
};

testGeminiAPI();
