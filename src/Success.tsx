import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Success: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('🎉 Payment Success');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');

    if (!user || !sessionId) {
      setMessage('❌ Missing session ID or user not logged in.');
    } else {
      setMessage('🎉 Payment successful! Your account is being updated.');
    }

    const timer = setTimeout(() => {
      navigate('/caption-tool');
    }, 5000);

    return () => clearTimeout(timer);
  }, [location, user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">🎉 Payment Success</h1>
        <p>{message}</p>
        <p className="text-sm text-gray-400 mt-2">Redirecting you shortly...</p>
      </div>
    </div>
  );
};

export default Success;
