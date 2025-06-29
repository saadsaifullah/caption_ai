// /src/pages/Success.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './context/AuthContext';

const Success: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState('🎉 Completing your purchase...');

  useEffect(() => {
    const verifyAndUpdate = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');

      if (!sessionId || !user) {
        setMessage('❌ Missing session ID or user not logged in.');
        return;
      }

      try {
        // Call your Netlify function to verify session (optional but recommended)
        const res = await fetch(`/.netlify/functions/verify-checkout-session?session_id=${sessionId}`);
        const data = await res.json();

        if (!data.success) {
          setMessage('❌ Error verifying session. Please contact support.');
          return;
        }

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        // Tokens
        if (data.tokens) {
          const newTokens = parseInt(data.tokens);
          const prevTokens = userSnap.exists() ? userSnap.data()?.tokens || 0 : 0;
          await setDoc(userRef, { tokens: prevTokens + newTokens }, { merge: true });
          setMessage(`✅ Added ${newTokens} tokens to your account.`);
        }

        // Plan
        if (data.plan === 'monthly' || data.plan === 'yearly') {
          const expires = new Date();
          expires.setMonth(expires.getMonth() + (data.plan === 'monthly' ? 1 : 12));
          await setDoc(userRef, {
            plan: data.plan,
            planExpires: expires.toISOString(),
          }, { merge: true });
          setMessage(`✅ ${data.plan} plan activated.`);
        }

        // Redirect after short delay
        setTimeout(() => navigate('/caption-tool'), 4000);
      } catch (err) {
        console.error('Error completing success flow:', err);
        setMessage('❌ Something went wrong while updating your account.');
      }
    };

    verifyAndUpdate();
  }, [location, navigate, user]);

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
