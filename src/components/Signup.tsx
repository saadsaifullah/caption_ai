import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (loading) return;

    setError('');
    setLoading(true);

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        firstName,
        lastName,
        email,
        uploadCount: 0,
        createdAt: new Date().toISOString()
      });

      navigate('/');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4">
      <div className="w-full max-w-md bg-[#161b22] p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-bold text-center text-pink-500 mb-6">
          Create an Account
        </h2>
        <div className="h-1 w-12 bg-pink-500 mx-auto mb-6 rounded-full" />

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-400/40 rounded text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            className="w-full px-4 py-2 rounded-md bg-[#0d1117] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 rounded-md bg-[#0d1117] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 rounded-md bg-[#0d1117] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 rounded-md bg-[#0d1117] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 rounded-md bg-[#0d1117] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 rounded-md transition-all"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
