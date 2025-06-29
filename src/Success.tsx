import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from './firebase'; // adjust path if needed
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Success: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('🎉 Payment Success');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');

    const handleSuccess = async () => {
      if (!user || !sessionId) {
        setMessage('❌ Missing session ID or user not logged in.');
        return;
      }

      try {
        const res = await fetch(
          `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
            },
          }
        );

        const data = await res.json();
        const metadata = data.metadata;
        const plan = metadata?.plan;
        const tokens = parseInt(metadata?.tokens || '0');

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        // Add tokens
        if (tokens) {
          const prevTokens = userSnap.exists() ? userSnap.data()?.tokens || 0 : 0;
          await setDoc(userRef, { tokens: prevTokens + tokens }, { merge: true });
        }

        // Add plan
        if (plan === 'monthly' || plan === 'yearly') {
          const expires = new Date();
          expires.setMonth(expires.getMonth() + (plan === 'monthly' ? 1 : 12));
          await setDoc(
            userRef,
            {
              plan,
              planExpires: expires.toISOString(),
            },
            { merge: true }
          );
        }

        setMessage('🎉 Payment successful! Your account has been updated.');
      } catch (err) {
        console.error('🔥 Error updating Firestore from success page:', err);
        setMessage('❌ Failed to verify payment or update your account.');
      }
    };

    handleSuccess();

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
