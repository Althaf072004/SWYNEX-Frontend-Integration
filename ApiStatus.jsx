import React, { useEffect, useState } from 'react';
import api from '../services/api';

/** Small non-blocking connection indicator; it never hides the app on API failure. */
export default function ApiStatus() {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Checking API connection…');

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        await api.get('/health', { timeout: 5000 });
        if (active) { setStatus('online'); setMessage('Backend connected'); }
      } catch (_) {
        if (active) { setStatus('offline'); setMessage('Backend unavailable — check server and API URL'); }
      }
    };
    check();
    const timer = window.setInterval(check, 30000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  return (
    <div role="status" aria-live="polite" className={`api-status api-status--${status}`} title={message}>
      <span className="api-status__dot" />{message}
    </div>
  );
}
