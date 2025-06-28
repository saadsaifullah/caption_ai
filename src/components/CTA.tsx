// src/components/CTA.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CTA: React.FC = () => {
  const { user } = useAuth();

  return (
    <section className="bg-gray-100 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Caption Smarter?</h2>
        <p className="mb-8">Upload your content and let our AI do the rest.</p>
        <Link
          to={user ? '/caption-tool' : '/subscribe'}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default CTA;
