document.addEventListener('DOMContentLoaded', () => {
    const emailSection = document.getElementById('email-section');
    const otpSection = document.getElementById('otp-section');
    const successSection = document.getElementById('success-section');
    const emailInput = document.getElementById('email');
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const verifyOtpBtn = document.getElementById('verify-otp-btn');
    const resendOtpBtn = document.getElementById('resend-otp-btn');
    const backBtn = document.getElementById('back-btn');
    const emailMsg = document.getElementById('email-msg');
    const otpMsg = document.getElementById('otp-msg');
    const displayEmail = document.getElementById('display-email');
    const otpInputs = document.querySelectorAll('.otp-input');

    const API_BASE = 'http://localhost:5000/api';

    // Helper: Show Message
    const showMsg = (el, msg, type) => {
        el.innerText = msg;
        el.className = `msg ${type}`;
        setTimeout(() => { el.innerText = ''; }, 5000);
    };

    // Step 1: Send OTP
    sendOtpBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        if (!email) return showMsg(emailMsg, 'Please enter a valid email', 'error');

        sendOtpBtn.disabled = true;
        sendOtpBtn.innerText = 'Sending OTP...';
        sendOtpBtn.classList.add('loading');

        try {
            const res = await fetch(`${API_BASE}/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (data.success) {
                displayEmail.innerText = email;
                emailSection.classList.add('hidden');
                otpSection.classList.remove('hidden');
                showMsg(otpMsg, 'Code sent to your email', 'success');
            } else {
                showMsg(emailMsg, data.message, 'error');
            }
        } catch (error) {
            showMsg(emailMsg, 'Failed to connect to server', 'error');
        } finally {
            sendOtpBtn.disabled = false;
            sendOtpBtn.innerText = 'Send OTP Code';
            sendOtpBtn.classList.remove('loading');
        }
    });

    // Step 2: Verify OTP
    verifyOtpBtn.addEventListener('click', async () => {
        const otpStr = Array.from(otpInputs).map(input => input.value).join('');
        if (otpStr.length !== 6) return showMsg(otpMsg, 'Enter entire code', 'error');

        verifyOtpBtn.disabled = true;
        verifyOtpBtn.innerText = 'Verifying...';

        try {
            const res = await fetch(`${API_BASE}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value.trim(), otp: otpStr })
            });

            const data = await res.json();
            if (data.success) {
                otpSection.classList.add('hidden');
                successSection.classList.remove('hidden');
            } else {
                showMsg(otpMsg, data.message, 'error');
            }
        } catch (error) {
            showMsg(otpMsg, 'Failed to connect to server', 'error');
        } finally {
            verifyOtpBtn.disabled = false;
            verifyOtpBtn.innerText = 'Verify OTP';
        }
    });

    // Logic: OTP input focus and keydown
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.inputType === 'deleteContentBackward') return;
            if (input.value && index < 5) otpInputs[index + 1].focus();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // Logic: Resend OTP
    resendOtpBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        resendOtpBtn.disabled = true;
        let timer = 30;
        const interval = setInterval(() => {
            resendOtpBtn.innerText = `Wait ${timer}s`;
            timer--;
            if (timer < 0) {
                clearInterval(interval);
                resendOtpBtn.disabled = false;
                resendOtpBtn.innerText = 'Resend Code';
            }
        }, 1000);

        try {
            const res = await fetch(`${API_BASE}/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.success) {
                showMsg(otpMsg, 'Code resent successfully', 'success');
            } else {
                showMsg(otpMsg, data.message, 'error');
            }
        } catch (error) {
            showMsg(otpMsg, 'Connection failed', 'error');
        }
    });

    backBtn.addEventListener('click', () => {
        otpSection.classList.add('hidden');
        emailSection.classList.remove('hidden');
    });
});
