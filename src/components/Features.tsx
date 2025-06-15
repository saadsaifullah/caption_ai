// src/components/Features.tsx
import React from 'react';

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {['Fast Captions', 'Smart AI', 'Easy Download'].map((feature, idx) => (
            <div key={idx} className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">{feature}</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
