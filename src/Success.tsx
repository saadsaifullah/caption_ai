import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Success: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('🎉 Thank you! Your payment was successful.');

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/caption-tool');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
