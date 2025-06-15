// src/components/CTA.tsx
import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="bg-blue-600 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Caption Smarter?</h2>
        <p className="mb-8">Upload your content and let our AI do the rest.</p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default CTA;
