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


function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Home />
              <CTA />
            </>
          } />
          <Route path="/how-it-works" element={<HowItWorks />} />
           <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/CaptionTool" element={<CaptionTool />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
export default App;
