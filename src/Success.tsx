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

  const [message, setMessage] = useState('Completing your purchase...');

  useEffect(() => {
    const grantTokens = async () => {
      console.log('✅ Success page loaded');
      if (!user) {
        console.warn('⚠️ User not logged in');
        setMessage('❌ You must be logged in to receive tokens.');
        return;
      }

      if (!tokenParam) {
        console.warn('⚠️ No token parameter found in URL');
        setMessage('❌ Missing token information.');
        return;
      }

      const tokens = parseInt(tokenParam);
      if (isNaN(tokens) || tokens <= 0) {
        console.warn('⚠️ Invalid token value:', tokenParam);
        setMessage('❌ Invalid token amount.');
        return;
      }

      try {
        const uid = user.uid;
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, { tokens });
          console.log('🆕 Created new user doc with tokens:', tokens);
        } else {
          const currentTokens = userSnap.data().tokens || 0;
          await updateDoc(userRef, { tokens: currentTokens + tokens });
          console.log('✅ Updated tokens from', currentTokens, 'to', currentTokens + tokens);
        }

        setMessage(`✅ You’ve received ${tokens} tokens.`);
        setTimeout(() => navigate('/'), 4000);
      } catch (error) {
        console.error('❌ Firestore update error:', error);
        setMessage('❌ Payment was successful, but token update failed.');
      }
    };

    grantTokens();
  }, [user, tokenParam, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">🎉 Payment Success</h1>
        <p className="text-lg">{message}</p>
        <p className="text-sm mt-2 text-gray-400">Redirecting you shortly...</p>
      </div>
    </div>
  );
};

export default Success;
