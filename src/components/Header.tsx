import React, { useEffect } from 'react';

const Hero: React.FC = () => {
  useEffect(() => {
    const targets = document.querySelectorAll('[data-target]');
    const contents = document.querySelectorAll('.page-content');
    const links = document.querySelectorAll('header .nav-header-link');

    const showPage = (id: string) => {
      contents.forEach(c => {
        (c as HTMLElement).classList.toggle('hidden', c.id !== id);
      });

      links.forEach(l => {
        const el = l as HTMLElement;
        if (el.dataset.target === id) {
          el.classList.add('text-white', 'font-semibold');
          el.classList.remove('text-gray-300');
        } else {
          el.classList.remove('text-white', 'font-semibold');
          el.classList.add('text-gray-300');
        }
      });

      window.scrollTo(0, 0);
    };

    targets.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = (e.currentTarget as HTMLElement).dataset.target;
        if (targetId) showPage(targetId);
      });
    });

    let pageId = 'page-home';
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const candidate = `page-${hash}`;
      if (document.getElementById(candidate)) pageId = candidate;
    }

    const targetEl = document.getElementById(pageId) ?? document.querySelector('.page-content');
    if (targetEl) showPage((targetEl as HTMLElement).id);
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="text-center py-24 md:py-36 bg-gradient-to-b from-[#0d1117] to-[#161b22] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-pink-600/10 via-purple-500/5 to-transparent rounded-full w-[60vw] h-[60vw] mx-auto blur-3xl animate-pulse z-0" />
        <div className="relative container mx-auto px-6 z-10">
          <div className="max-w-3xl mx-auto">
            <img
              src="/HOME.jpg"
              alt="Hero Visual"
              className="w-full max-w-md mx-auto rounded-xl shadow-xl mb-10"
            />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 drop-shadow-lg text-glow">
              Fulfill your fantasies
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload your image and let our advanced AI analyze the content, describe the scene, and generate the perfect caption.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="/caption-tool"
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-pink-500/30"
              >
                🚀 Try The App
              </a>
              <a
                href="/subscribe"
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                💎 View Plans
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-20 bg-[#161b22] border-y border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">A Simple, Powerful Process</h3>
            <p className="text-gray-400 mt-2">Transform your images into captioned masterpieces in five easy steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { icon: '⬆️', title: 'Upload Image', desc: 'Upload any picture securely, SFW or NSFW.' },
              { icon: '💡', title: 'AI Analysis', desc: 'Our AI understands content, not just pixels.' },
              { icon: '⚙️', title: 'Choose Style', desc: 'Select themes like Hotwife, Cuckold, SPH, etc.' },
              { icon: '💬', title: 'Generate Caption', desc: 'Let AI create tailored captions for your image.' },
              { icon: '⬇️', title: 'Download & Share', desc: 'Ready-to-use images for posting or private use.' }
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-[#0d1117] p-6 border border-gray-700 rounded-2xl text-center hover:-translate-y-1 hover:border-pink-500 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{step.icon}</div>
                <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Ready to have fun?</h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Try Texotica Caption AI for free and share your captions... or keep them just for yourself 😉
          </p>
          <a
            href="/caption-tool"
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-10 rounded-lg transition-colors text-lg"
          >
            Get Started Now
          </a>
        </div>
      </section>
    </>
  );
};

export default Hero;
