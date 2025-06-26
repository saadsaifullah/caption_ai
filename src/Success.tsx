// /src/pages/Success.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

const Success: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');
  const [message, setMessage] = useState('🎉 Completing your purchase...');

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setMessage('❌ Missing session ID.');
        return;
      }

      try {
        const res = await fetch(`/.netlify/functions/verify-checkout-session?session_id=${sessionId}`);
        const data = await res.json();

        if (!data.success) {
          setMessage('❌ Error verifying payment. Please try again.');
          return;
        }

        const uid = data.uid;
        if (!uid) {
          setMessage('❌ No user ID found.');
          return;
        }

        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        // Token Pack
        if (data.tokens) {
          const tokens = parseInt(data.tokens);
          if (!userSnap.exists()) {
            await setDoc(userRef, { tokens });
          } else {
            const prev = userSnap.data()?.tokens || 0;
            await updateDoc(userRef, { tokens: prev + tokens });
          }
          setMessage(`✅ You've received ${tokens} tokens!`);
        }

        // Plan
        if (data.plan === 'monthly' || data.plan === 'yearly') {
          const expires = new Date();
          expires.setMonth(expires.getMonth() + (data.plan === 'monthly' ? 1 : 12));
          await updateDoc(userRef, {
            plan: data.plan,
            planExpires: expires.toISOString()
          });
          setMessage(`✅ Your ${data.plan} plan is now active.`);
        }

        setTimeout(() => navigate('/caption-tool'), 4000);
      } catch (err) {
        console.error('Success error:', err);
        setMessage('❌ Could not verify session.');
      }
    };

    verifySession();
  }, [sessionId, navigate]);

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
