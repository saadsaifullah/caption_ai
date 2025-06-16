import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from "./src/components/Header";
import Home from "./src/components/Hero";
import Steps from "./src/components/Steps";
import Features from "./src/components/Features";
import CTA from "./src/components/CTA";
import Footer from "./src/components/Footer";
import HowItWorks from './src/components/HowItWorks'; // newly added
import Subscribe from './src/components/Subscribe';
import CaptionTool from './src/components/CaptionTool'; // 👈 rename the second App.tsx to this
import Signup from './src/components/Signup';
import Login from './src/components/Login';
import ProtectedRoute from './src/components/ProtectedRoute';
import Success from './src/Success';
import { AuthProvider } from './src/context/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow pt-24">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Home />
                  <CTA />
                </>
              } />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/success" element={<Success />} />

              {/* Protected Route */}
              <Route
                path="/caption-tool"
                element={
                  <ProtectedRoute>
                    <CaptionTool />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

