import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './src/components/Header';
import Hero from './src/components/Hero';
import CTA from './src/components/CTA';
import Footer from './src/components/Footer';
import HowItWorks from './src/components/HowItWorks';
import Subscribe from './src/components/Subscribe';
import CaptionTool from './src/components/CaptionTool';
import Signup from './src/components/Signup';
import Login from './src/components/Login';
import Success from './src/Success';
import Profile from './src/components/Profile';
import ChangePassword from './src/components/ChangePassword';
import ProtectedRoute from './src/components/ProtectedRoute';
import ForgotPassword from './src/components/ForgotPassword'; // ✅ NEW IMPORT
import { AuthProvider, useAuth } from './src/context/AuthContext';

const AppRoutes = () => {
  const { authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p className="text-lg">Checking authentication...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Hero />
            <CTA />
          </>
        }
      />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/subscribe" element={<Subscribe />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ New Route */}
      <Route path="/success" element={<Success />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/change-password" element={<ChangePassword />} />

      <Route
        path="/caption-tool"
        element={
          <ProtectedRoute>
            <CaptionTool />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#0d1117] text-white">
          <Header />
          <main className="flex-grow pt-24">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
