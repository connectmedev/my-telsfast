import React from 'react';

const LoadingScreen = ({ show }) => {
  return (
    <div className={`loading-screen ${show ? 'show' : ''}`}>
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingScreen;
