import React from 'react';
const Hero = () => (
  <section className="text-center py-24 md:py-36 bg-gradient-to-b from-[#0d1117] to-[#161b22] text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-radial from-pink-600/10 via-purple-500/5 to-transparent rounded-full w-[60vw] h-[60vw] mx-auto blur-3xl animate-pulse z-0" />

    <div className="relative container mx-auto px-6 z-10">
      <div className="max-w-3xl mx-auto">
        {/* Icon with glow effect */}
        <div className="rounded-full mx-auto w-48 h-48 md:w-64 md:h-64 mb-8 flex items-center justify-center bg-pink-500/10 border border-pink-500/20 shadow-2xl shadow-pink-500/10 backdrop-blur-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 md:w-32 md:h-32 text-pink-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 drop-shadow-lg">
          Fulfill your fantasies
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your image and let our advanced AI analyze the content, describe the scene, and generate the perfect caption. All in seconds.
        </p>

        {/* CTA buttons */}
        <div className="flex justify-center space-x-4">
          <a
            href="/caption-tool"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md shadow-pink-500/20 hover:scale-105"
          >
            🚀 Try The App
          </a>
          <a
            href="/subscribe"
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md shadow-gray-600/20 hover:scale-105"
          >
            💎 View Plans
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;

