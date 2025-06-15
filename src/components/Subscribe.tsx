import React from 'react';
import PricingCard from '../components/PricingCard';
import TokenPack from '../components/TokenPack';
const Subscribe: React.FC = () => {
  return (
    <div className="text-white font-['Inter'] bg-[#0d1117] min-h-screen">
      {/* Header */}
 

      {/* Title */}
      <main className="container mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Find Your Perfect Plan</h2>
        </div>

        {/* Pricing Grid */}
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
              />
              <TokenPack
                title="10,000 Tokens"
                subtext="~1,000 Generations"
                price="$99"
                original="$216"
                button="Buy 10K Tokens"
              />
            </div>
            <p className="text-xs text-gray-500 mt-6 text-center">
              1 caption = 10 tokens. Tokens never expire.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Subscribe;
