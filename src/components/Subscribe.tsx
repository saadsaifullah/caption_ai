import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PricingCard from '../components/PricingCard';
import TokenPack from '../components/TokenPack';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Subscribe: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const limitMessage = searchParams.get('limit');

  const { user } = useAuth();
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (planId: string) => {
    if (!user) {
      alert('Please login first to buy a plan.');
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId })
      });

      const data = await res.json();
      if (data?.url) {
        // Save plan info in Firestore before redirect (only for subscriptions)
        if (planId === 'monthly' || planId === 'yearly') {
          const userRef = doc(db, 'users', user.uid);
          const planData = {
            plan: planId,
            planExpires: planId === 'monthly'
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          };

          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            await updateDoc(userRef, planData);
          } else {
            await setDoc(userRef, { ...planData });
          }
        }

        window.location.href = data.url;
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Error connecting to payment server.');
    }
  };

  const handleCustomCheckout = async () => {
    if (!user) {
      alert('Please login first to buy tokens.');
      return;
    }

    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount < 1) {
      alert('Please enter a valid amount (minimum $1)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'custom', amount })
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Custom checkout error:', err);
      alert('Error connecting to payment server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white font-['Inter'] bg-[#0d1117] min-h-screen">
      <main className="container mx-auto px-6 py-12 md:py-20">
        {limitMessage && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-yellow-200 text-yellow-800 rounded-lg border border-yellow-400 text-center shadow">
            ⚠️ {decodeURIComponent(limitMessage)}
          </div>
        )}

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Find Your Perfect Plan</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          {/* Monthly Plan */}
          <PricingCard
            title="Monthly"
            price="$9"
            original="$14"
            period="/month"
            features={["50 Generations/Day", "Daily Limit Reset", "Standard Support"]}
            buttonLabel="Choose Monthly"
            color="blue"
            onClick={() => handleCheckout('monthly')}
          />

          {/* Yearly Plan */}
          <PricingCard
            title="Yearly"
            price="$89"
            original="$168"
            period="/year"
            features={[
              "100 Generations/Day",
              "Daily Limit Reset",
              "Priority Support",
              "Early Access to New Features"
            ]}
            buttonLabel="Choose Yearly"
            color="pink"
            bestValue
            onClick={() => handleCheckout('yearly')}
          />

          {/* Token Packs */}
          <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-8 h-full flex flex-col hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 ease-in-out">
            <h3 className="text-2xl font-semibold mb-6">Token Packs</h3>
            <div className="space-y-6 flex-grow">
              <TokenPack
                title="1,000 Tokens"
                subtext="~100 Generations"
                price="$12"
                original="$18"
                button="Buy 1K Tokens"
                onClick={() => handleCheckout('tokens1000')}
              />
              <TokenPack
                title="10,000 Tokens"
                subtext="~1,000 Generations"
                price="$99"
                original="$216"
                button="Buy 10K Tokens"
                onClick={() => handleCheckout('tokens10000')}
              />
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-2">Custom Token Amount</h4>
              <input
                type="number"
                min="1"
                placeholder="Enter $ amount (e.g. 5)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full p-2 mb-3 rounded bg-gray-900 border border-gray-600 text-white placeholder-gray-400"
              />
              <button
                onClick={handleCustomCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-2 px-4 rounded transition-all duration-200"
              >
                {loading ? 'Processing...' : 'Buy Custom Tokens'}
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">1 caption = 10 tokens</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subscribe;
