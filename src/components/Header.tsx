import React from 'react';

const Hero: React.FC = () => {
  return (
    <main className="font-sans text-white bg-[#0d1117]">
      {/* Hero Section with Custom Image */}
      <section className="text-center py-24 md:py-36 bg-gradient-to-b from-[#0d1117] to-[#161b22] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-pink-600/10 via-purple-500/5 to-transparent rounded-full w-[60vw] h-[60vw] mx-auto blur-3xl animate-pulse z-0" />
        <div className="relative container mx-auto px-6 z-10">
          <div className="max-w-3xl mx-auto">
            <img
              src="/HOME.jpg"
              alt="Hero Visual"
              className="w-full max-w-md mx-auto rounded-xl shadow-xl mb-10"
            />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 drop-shadow-lg">
              Fulfill your fantasies
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload your image and let our advanced AI analyze the content, describe the scene,
              and generate the perfect caption. All in seconds.
            </p>
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

      {/* CTA Section from HTML */}
      <section className="bg-[#0d1117] py-16 px-6 md:px-0 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Create Smart Captions from Images</h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-6">
          The fastest, easiest, and most accurate way to generate captions using AI.
        </p>
        <a
          href="/caption-tool"
          className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-10 rounded-lg transition-all"
        >
          Get Started Free
        </a>
      </section>

      {/* Feature Grid Section */}
      <section className="bg-[#0d1117] py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Texotica Caption AI?</h2>
          <p className="text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
            From image analysis to auto-styled captions – everything you need in one place.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Image Analysis',
                desc: 'Our AI understands the image context before captioning.',
                emoji: '🧠'
              },
              {
                title: 'Choose Caption Style',
                desc: 'Customize tone, length, emotion, and appearance.',
                emoji: '🎨'
              },
              {
                title: 'Instant Captions',
                desc: 'Generate perfect captions in seconds and download your content.',
                emoji: '⚡'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-[#161b22] border border-gray-700 p-6 rounded-xl transition-all hover:scale-105 hover:border-purple-500"
              >
                <div className="text-3xl mb-4">{feature.emoji}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
