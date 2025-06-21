import React, { useEffect } from 'react';

const Hero = () => {
  useEffect(() => {
    const pageTargets = document.querySelectorAll('[data-target]');
    const pageContents = document.querySelectorAll('.page-content');
    const headerNavLinks = document.querySelectorAll('header .nav-header-link');

    function showPage(targetId: string) {
      pageContents.forEach(content => {
        const el = content as HTMLElement;
        el.classList.toggle('hidden', el.id !== targetId);
      });

      headerNavLinks.forEach(link => {
        const el = link as HTMLElement;
        if (el.dataset.target === targetId) {
          el.classList.remove('text-gray-300', 'hover:text-white');
          el.classList.add('text-white', 'font-semibold');
        } else {
          el.classList.remove('text-white', 'font-semibold');
          el.classList.add('text-gray-300', 'hover:text-white');
        }
      });

      window.scrollTo(0, 0);
    }

    pageTargets.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = (e.currentTarget as HTMLElement).dataset.target;
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el?.classList.contains('page-content')) showPage(targetId);
        }
      });
    });

    let initialPageId = 'page-home';
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const potential = `page-${hash}`;
      if (document.getElementById(potential)) initialPageId = potential;
    }

    const initialEl = document.getElementById(initialPageId);
    if (initialEl) {
      showPage(initialPageId);
    } else {
      const fallback = document.querySelector('.page-content') as HTMLElement;
      if (fallback) showPage(fallback.id);
    }
  }, []);

  return (
    <>
      {/* Process Steps Section */}
      <section className="py-20 bg-[#0d1117] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">A Simple, Powerful Process</h2>
          <p className="text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
            Transform your images into captioned masterpieces in five easy steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                title: '1. Upload Image',
                icon: '⬆️',
                desc: 'Securely upload any picture from your device, SFW or NSFW.',
              },
              {
                title: '2. AI Analysis',
                icon: '💡',
                desc: 'Our AI analyzes the visual content, identifying objects, themes, and nuances.',
              },
              {
                title: '3. Choose Style',
                icon: '⚙️',
                desc: 'Choose from themes like Hotwife, Cuckold, Bully, SPH, Challenges, and much more.',
              },
              {
                title: '4. Generate Caption',
                icon: '💬',
                desc: 'Based on its analysis and your preferences, the AI crafts a caption.',
              },
              {
                title: '5. Download & Share',
                icon: '⬇️',
                desc: 'Your final image with its text overlay is ready to download and share.',
              },
            ].map((step, index) => (
              <div
                key={index}
                className="transition-all duration-300 bg-[#161b22] hover:bg-[#1f2937] p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-700"
              >
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero / Main CTA Section */}
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
    </>
  );
};

export default Hero;
