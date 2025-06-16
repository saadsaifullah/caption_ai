import React from 'react';
const Hero = () => (
  <section className="text-center py-20 md:py-32">
    <div className="container mx-auto px-6">
      <div className="max-w-3xl mx-auto">
        <div className="hero-glow rounded-full mx-auto w-48 h-48 md:w-64 md:h-64 mb-8 flex items-center justify-center bg-pink-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 md:w-32 md:h-32 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-glow">Fulfill your fantasies</h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Upload your image and let our advanced AI analyze the content, describe the scene, and generate the perfect caption. Effortlessly.
        </p>
        <div className="flex justify-center space-x-4">
          <a href="caption-tool" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">Try The App</a>
          <a href="subscribe" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">View Plans</a>
        </div>
      </div>
    </div>
  </section>
);
export default Hero;
