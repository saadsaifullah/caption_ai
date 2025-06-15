// src/components/Steps.tsx
import React from 'react';

const Steps: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {['Upload', 'Generate', 'Download'].map((step, idx) => (
            <div key={idx} className="p-6 border rounded-xl shadow-md">
              <div className="text-5xl font-bold text-blue-500 mb-4">{idx + 1}</div>
              <h3 className="text-xl font-semibold">{step}</h3>
              <p className="mt-2 text-gray-600">Lorem ipsum dolor sit amet consectetur.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
