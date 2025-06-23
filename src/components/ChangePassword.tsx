import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';

const ChangePassword: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('User not authenticated.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await updatePassword(user, newPassword);
      setSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#161b22] p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>

        {error && <p className="text-red-400 mb-4 text-sm text-center">{error}</p>}
        {success && <p className="text-green-400 mb-4 text-sm text-center">{success}</p>}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-[#0d1117] border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-[#0d1117] border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded"
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="w-full text-sm text-purple-400 mt-2 hover:underline"
          >
            ← Back to Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
