// Test script for OTP password reset flow
// This script tests the complete flow from forgot password to reset

const testEmail = 'test@example.com';

async function testOtpFlow() {
  console.log('🧪 Testing OTP Password Reset Flow...\n');
  
  try {
    // Step 1: Request OTP
    console.log('📧 Step 1: Requesting OTP...');
    const forgotResponse = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    
    const forgotData = await forgotResponse.json();
    console.log('✅ Forgot password response:', forgotData);
    
    // Wait a moment for the OTP to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 2: Verify OTP (you'll need to get the OTP from console logs)
    console.log('\n🔍 Step 2: Check the console logs for the OTP and enter it manually');
    console.log('📝 Then test the verify-otp endpoint with the actual OTP');
    
    // Example OTP verification (replace with actual OTP from console)
    const testOtp = '123456'; // Replace this with the actual OTP from console
    
    console.log('\n🔐 Step 3: Testing OTP verification...');
    const verifyResponse = await fetch('http://localhost:3000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, otp: testOtp })
    });
    
    const verifyData = await verifyResponse.json();
    console.log('📊 Verify OTP response:', verifyData);
    
    if (verifyResponse.ok) {
      // Step 3: Reset password
      console.log('\n🔑 Step 4: Testing password reset...');
      const resetResponse = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: testEmail, 
          otp: testOtp, 
          newPassword: 'newSecurePassword123' 
        })
      });
      
      const resetData = await resetResponse.json();
      console.log('📊 Reset password response:', resetData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testOtpFlow();
