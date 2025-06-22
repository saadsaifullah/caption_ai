import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAccessRestricted, setIsAccessRestricted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

        setIsAccessRestricted(!hasPlan && tokens < 10 && uploadCount >= 5);
      }
    };

    checkAccess();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117] text-white shadow border-b border-[#222]">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gradient bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Texotica Caption AI
        </Link>

        <nav className="hidden md:flex items-center space-x-6 font-medium">
          <Link to="/" className="hover:text-pink-400 transition">Home</Link>

          {isAccessRestricted ? (
            <span className="text-gray-500 cursor-not-allowed">App</span>
          ) : (
            <Link to="/caption-tool" className="hover:text-pink-400 transition">App</Link>
          )}

          <Link to="/subscribe" className="hover:text-pink-400 transition">Subscribe</Link>
          <Link to="/how-it-works" className="hover:text-pink-400 transition">How To Use</Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="ml-4 text-white text-2xl hover:text-purple-300"
              >
                <FaUserCircle />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded shadow-lg py-2 z-50">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">👤 Profile</Link>
                  <Link to="/change-password" className="block px-4 py-2 hover:bg-gray-100">🔒 Change Password</Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="ml-4 px-4 py-1 border border-purple-500 rounded hover:bg-purple-600 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="ml-2 px-4 py-1 bg-purple-500 rounded hover:bg-purple-600 text-white transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2 text-sm font-medium">
          <Link to="/" className="block hover:text-pink-400">Home</Link>
          {isAccessRestricted ? (
            <span className="block text-gray-500 cursor-not-allowed">App</span>
          ) : (
            <Link to="/caption-tool" className="block hover:text-pink-400">App</Link>
          )}
          <Link to="/subscribe" className="block hover:text-pink-400">Subscribe</Link>
          <Link to="/how-it-works" className="block hover:text-pink-400">How To Use</Link>

          {user ? (
            <button onClick={handleLogout} className="block text-red-400 px-4 py-1 border border-red-500 rounded hover:bg-red-600 w-full">
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
