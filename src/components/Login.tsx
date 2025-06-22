import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user } = useAuth(); // ✅ Access logged-in user from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ If user is already logged in, redirect to homepage
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const login = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await auth.signOut();
        setError('Please verify your email before logging in.');
        setLoading(false);
        return;
      }

      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4">
      <div className="w-full max-w-md bg-[#161b22] p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-bold text-center text-pink-500 mb-6">
          Login and get started
        </h2>
        <div className="h-1 w-12 bg-pink-500 mx-auto mb-6 rounded-full" />

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-400/40 rounded text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full px-4 py-2 rounded-md bg-[#0d1117] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              className="w-full px-4 py-2 rounded-md bg-[#0d1117] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 rounded-md transition-all"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-pink-500 hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
