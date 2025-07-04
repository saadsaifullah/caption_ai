import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const data = snap.data();
      const plan = data.plan;
      const todayKey = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const usageKey = `used_${todayKey}`;
      const usedToday = data[usageKey] || 0;

      let dailyLimit = 0;
      if (plan === 'yearly') dailyLimit = 100;
      else if (plan === 'monthly') dailyLimit = 50;
      else dailyLimit = 5; // free user

      const generationsLeft = dailyLimit - usedToday;

      const updatedUserData = {
        ...data,
        [usageKey]: usedToday,
        generationsLeft,
      };

      setUserData(updatedUserData);
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const handleUnsubscribe = async () => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    await updateDoc(ref, {
      plan: null,
      planExpires: null,
    });
    setUserData({ ...userData, plan: null, planExpires: null });
    setShowConfirm(false);
  };

  if (!user) {
    return (
      <div className="text-white p-8 bg-[#0d1117] min-h-screen text-center">
        <h2 className="text-3xl font-bold">You are not logged in.</h2>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="text-white p-8">Loading profile...</div>;
  }

  const plan = userData?.plan;
  const todayKey = new Date().toISOString().split('T')[0];
  const usedToday = userData?.[`used_${todayKey}`] || 0;

  const dailyLimit = plan === 'yearly' ? 100 : plan === 'monthly' ? 50 : 5;
  const generationsLeft = dailyLimit - usedToday;

  return (
    <div className="text-white p-8 bg-[#0d1117] min-h-screen">
      <div className="max-w-3xl mx-auto bg-[#161b22] p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Your Account</h1>
        <p className="text-lg mb-2">
          Welcome, <span className="text-purple-400 font-semibold">{userData?.firstName || 'User'}</span>!
        </p>
        <p className="text-sm text-gray-400 mb-6">Email: {user.email}</p>

        <div className="mb-6">
          <p><strong>Generations Left Today:</strong> {generationsLeft}</p>
          <p><strong>Tokens Left:</strong> {userData?.tokens || 0}</p>
          <p><strong>Subscription Plan:</strong> {plan || 'None'}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {plan ? (
            showConfirm ? (
              <>
                <button
                  onClick={handleUnsubscribe}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                  Yes, Unsubscribe
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
              >
                Manage Subscription
              </button>
            )
          ) : (
            <button
              onClick={() => navigate('/subscribe')}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            >
              Subscribe Now
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>

          {/* Change Password: Desktop Only */}
          <div className="hidden md:block">
            <button
              onClick={() => navigate('/change-password')}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
