import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const Success: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tokenParam = searchParams.get('tokens');

  const [message, setMessage] = useState('🎉 Completing your purchase...');

  useEffect(() => {
    const handleSuccess = async () => {
      if (!user) {
        setMessage('❌ You must be logged in to apply your purchase.');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      // If it's a token pack
      if (tokenParam) {
        const tokens = parseInt(tokenParam);
        if (isNaN(tokens) || tokens <= 0) {
          setMessage('❌ Invalid token amount.');
          return;
        }

        if (!userSnap.exists()) {
          await setDoc(userRef, { tokens });
          console.log('🆕 Created new user doc with tokens:', tokens);
        } else {
          const prevTokens = userSnap.data().tokens || 0;
          await updateDoc(userRef, { tokens: prevTokens + tokens });
          console.log(`✅ Added ${tokens} tokens. Total: ${prevTokens + tokens}`);
        }

        setMessage(`✅ You’ve received ${tokens} tokens.`);
      } else {
        // Plan-based purchase (monthly/yearly)
        if (!userSnap.exists()) {
          setMessage('❌ User data not found. Please contact support.');
          return;
        }

        const userData = userSnap.data();
        const plan = userData.plan;
        const planExpires = userData.planExpires;

        if (plan && planExpires) {
          setMessage(`✅ Your ${plan} plan is now active until ${new Date(planExpires).toLocaleDateString()}.`);
        } else {
          setMessage('✅ Subscription activated. Thank you!');
        }
      }

      // Redirect after 4 seconds
      setTimeout(() => navigate('/caption-tool'), 4000);
    };

    handleSuccess();
  }, [user, tokenParam, navigate]);

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
