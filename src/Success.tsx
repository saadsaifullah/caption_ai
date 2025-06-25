import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const Success: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(location.search).get('session_id');
  const [message, setMessage] = useState('🎉 Verifying your payment...');

  useEffect(() => {
    const verifySession = async () => {
      if (!user || !sessionId) {
        setMessage('❌ Missing user or session ID.');
        return;
      }

      try {
        const res = await fetch(`/.netlify/functions/verify-checkout-session?session_id=${sessionId}`);
        const data = await res.json();

        if (!data.success) {
          setMessage('❌ Payment not successful. Please contact support.');
          return;
        }

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (data.tokens) {
          const tokens = parseInt(data.tokens);
          const prevTokens = userSnap.exists() ? userSnap.data().tokens || 0 : 0;
          const newTotal = prevTokens + tokens;

          if (userSnap.exists()) {
            await updateDoc(userRef, { tokens: newTotal });
          } else {
            await setDoc(userRef, { tokens: newTotal });
          }

          setMessage(`✅ You've received ${tokens} tokens.`);
        } else if (data.plan) {
          const duration = data.plan === 'monthly'
            ? 30 * 24 * 60 * 60 * 1000
            : 365 * 24 * 60 * 60 * 1000;

          const planExpires = new Date(Date.now() + duration).toISOString();

          if (userSnap.exists()) {
            await updateDoc(userRef, { plan: data.plan, planExpires });
          } else {
            await setDoc(userRef, { plan: data.plan, planExpires });
          }

          setMessage(`✅ Your ${data.plan} plan is active until ${new Date(planExpires).toLocaleDateString()}.`);
        } else {
          setMessage('✅ Payment succeeded, but no product found.');
        }

        setTimeout(() => navigate('/caption-tool'), 4000);
      } catch (error) {
        console.error(error);
        setMessage('❌ Error verifying payment. Please try again.');
      }
    };

    verifySession();
  }, [user, sessionId, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center max-w-lg px-4">
        <h1 className="text-3xl font-bold mb-4">🎉 Payment Success</h1>
        <p className="text-lg">{message}</p>
        <p className="text-sm mt-2 text-gray-400">Redirecting you shortly...</p>
      </div>
    </div>
  );
};

export default Success;
