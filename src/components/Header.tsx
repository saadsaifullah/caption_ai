import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAccessRestricted, setIsAccessRestricted] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setIsAccessRestricted(false);
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        const hasPlan = !!data.plan && Date.now() < new Date(data.planExpires).getTime();
        const tokens = data.tokens || 0;
        const uploadCount = data.uploadCount || 0;

        // Restrict access if: no plan AND tokens < 10 AND uploadCount >= 5
        setIsAccessRestricted(!hasPlan && tokens < 10 && uploadCount >= 5);
      }
    };

    checkAccess();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Texotica Caption AI</h1>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-purple-300">Home</Link>
          {isAccessRestricted ? (
            <span className="text-gray-500 cursor-not-allowed">App</span>
          ) : (
            <Link to="/caption-tool" className="hover:text-purple-300">App</Link>
          )}
          <Link to="/subscribe" className="hover:text-purple-300">Subscribe</Link>
          <Link to="/how-it-works" className="hover:text-purple-300">How To Use</Link>

          {user ? (
            <button onClick={handleLogout} className="ml-4 px-4 py-1 border border-red-500 rounded hover:bg-red-600">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="ml-4 px-4 py-1 border border-purple-500 rounded hover:bg-purple-600">Login</Link>
              <Link to="/signup" className="ml-2 px-4 py-1 bg-purple-500 rounded hover:bg-purple-600 text-white">Sign Up</Link>
            </>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          <Link to="/" className="block hover:text-purple-300">Home</Link>
          {isAccessRestricted ? (
            <span className="block text-gray-500 cursor-not-allowed">App</span>
          ) : (
            <Link to="/caption-tool" className="block hover:text-purple-300">App</Link>
          )}
          <Link to="/subscribe" className="block hover:text-purple-300">Subscribe</Link>
          <Link to="/how-it-works" className="block hover:text-purple-300">How To Use</Link>
          {user ? (
            <button onClick={handleLogout} className="block text-red-400 px-4 py-1 border border-red-500 rounded hover:bg-red-600">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="block text-purple-400">Login</Link>
              <Link to="/signup" className="block text-purple-400">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;