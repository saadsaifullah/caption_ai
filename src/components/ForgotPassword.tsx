// src/components/ForgotPassword.tsx
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('✅ A password reset link has been sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4 text-white">
      <div className="w-full max-w-md bg-[#161b22] p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-pink-500">
          Forgot your password?
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Enter your email below and we’ll send you a link to reset your password.
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-500/10 text-green-400 border border-green-400/40 rounded text-sm text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-400/40 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[#0d1117] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 rounded-md transition-all"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-sm text-gray-400 mt-6 text-center">
          <span
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Back to Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
