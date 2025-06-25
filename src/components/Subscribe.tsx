import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Subscribe: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const limitMessage = searchParams.get('limit');

  const { user } = useAuth();
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

  return (
    <div className="bg-[#0d1117] text-white min-h-screen font-['Inter']">
      <main className="container mx-auto px-6 py-12 md:py-20">
        {limitMessage && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-yellow-200 text-yellow-800 rounded-lg border border-yellow-400 text-center shadow">
            ⚠️ {decodeURIComponent(limitMessage)}
          </div>
        )}

       <div className="text-center mb-16">
  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight 
    text-transparent bg-clip-text 
    bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 
    drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]">
    Choose Your Plan
  </h2>
</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Monthly */}
          <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-8 flex flex-col shadow-md transform transition duration-300 ease-in-out hover:-translate-y-2 hover:ring-2 hover:ring-sky-400 hover:shadow-sky-500/30 h-full">
            <h3 className="text-2xl font-semibold mb-4 text-center text-purple-400">Monthly</h3>
            <div className="text-center text-4xl font-bold text-white">
              $9 <span className="text-gray-400 line-through text-xl">$14</span>
              <div className="text-sm font-medium text-gray-400">/month</div>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-gray-300 flex-grow">
              <li>✔ 50 Generations/Day</li>
              <li>✔ Daily Limit Reset</li>
              <li>✔ Standard Support</li>
            </ul>
            <button
              onClick={() => handleCheckout('monthly')}
              className="mt-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-bold text-sm transition-all duration-300"
            >
              Choose Monthly
            </button>
          </div>

          {/* Yearly */}
          <div className="bg-[#161b22] border-2 border-pink-500 rounded-2xl p-8 flex flex-col shadow-md transform transition duration-300 ease-in-out hover:-translate-y-2 hover:ring-2 hover:ring-pink-500 hover:shadow-pink-500/40 relative h-full">
            <div className="absolute top-0 right-0 bg-pink-500 text-xs font-bold text-white px-3 py-1 rounded-bl-lg">BEST VALUE</div>
            <h3 className="text-2xl font-semibold mb-4 text-center text-pink-400">Yearly</h3>
            <div className="text-center text-4xl font-bold text-white">
              $89 <span className="text-gray-400 line-through text-xl">$168</span>
              <div className="text-sm font-medium text-gray-400">/year</div>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-gray-300 flex-grow">
              <li>✔ 100 Generations/Day</li>
              <li>✔ Daily Limit Reset</li>
              <li>✔ Priority Support</li>
              <li>✔ Early Access to New Features</li>
            </ul>
            <button
              onClick={() => handleCheckout('yearly')}
              className="mt-8 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-bold text-sm transition-all duration-300"
            >
              Choose Yearly
            </button>
          </div>

          {/* Token Packs */}
          <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-8 flex flex-col shadow-md transform transition duration-300 ease-in-out hover:-translate-y-2 hover:ring-2 hover:ring-purple-400 hover:shadow-purple-500/30 h-full">
            <h3 className="text-2xl font-semibold mb-6 text-center text-purple-300">Token Packs</h3>
            <div className="space-y-6 flex-grow">
              <div className="p-4 border border-gray-600 rounded-lg bg-[#0d1117]">
                <div className="text-lg font-semibold mb-1 text-white">1,000 Tokens</div>
                <div className="text-sm text-gray-400 mb-2">~100 Generations</div>
                <div className="text-white text-xl font-bold mb-1">
                  $12 <span className="text-gray-400 line-through text-sm">$18</span>
                </div>
                <button
                  onClick={() => handleCheckout('tokens1000')}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 text-sm"
                >
                  Buy 1K Tokens
                </button>
              </div>

              <div className="p-4 border border-gray-600 rounded-lg bg-[#0d1117]">
                <div className="text-lg font-semibold mb-1 text-white">10,000 Tokens</div>
                <div className="text-sm text-gray-400 mb-2">~1,000 Generations</div>
                <div className="text-white text-xl font-bold mb-1">
                  $99 <span className="text-gray-400 line-through text-sm">$216</span>
                </div>
                <button
                  onClick={() => handleCheckout('tokens10000')}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 text-sm"
                >
                  Buy 10K Tokens
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">1 caption = 10 tokens. Tokens never expire.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subscribe;
