import React, { useEffect } from 'react';
import {
  UploadCloud,
  Lightbulb,
  Settings2,
  MessageCircle,
  Download,
} from 'lucide-react';

const steps = [
  {
    icon: <UploadCloud size={32} className="text-blue-400" />,
    title: '1. Upload Image',
    description: 'Securely upload any picture from your device, SFW or NSFW.',
    hoverColor: 'blue-400',
    shadow: 'shadow-blue-500/40',
  },
  {
    icon: <Lightbulb size={32} className="text-pink-500" />,
    title: '2. AI Analysis',
    description: 'Our AI analyzes the visual content, identifying objects, themes, and nuances.',
    hoverColor: 'pink-500',
    shadow: 'shadow-pink-500/40',
  },
  {
    icon: <Settings2 size={32} className="text-yellow-400" />,
    title: '3. Choose Style',
    description: 'Choose from themes like Hotwife, Cuckold, Bully, SPH, Challenges, and much more.',
    hoverColor: 'yellow-400',
    shadow: 'shadow-yellow-500/40',
  },
  {
    icon: <MessageCircle size={32} className="text-emerald-400" />,
    title: '4. Generate Caption',
    description: 'Based on its analysis, your preferences for style, length and visual appearance the AI crafts a caption.',
    hoverColor: 'emerald-400',
    shadow: 'shadow-emerald-500/40',
  },
  {
    icon: <Download size={32} className="text-purple-400" />,
    title: '5. Download & Share',
    description: 'Your final image with its text overlay is ready to download and share.',
    hoverColor: 'purple-400',
    shadow: 'shadow-purple-500/40',
  },
];
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
      {/* Hero Section */}
      <section className="text-center py-24 md:py-36 bg-gradient-to-b from-[#0d1117] to-[#161b22] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-pink-600/10 via-purple-500/5 to-transparent w-[60vw] h-[60vw] mx-auto blur-3xl animate-pulse z-0 rounded-full" />
        <div className="relative container mx-auto px-6 z-10">
          <div className="max-w-3xl mx-auto">
            <img
              src="/HOME.jpg"
              alt="Hero Visual"
              className="w-full max-w-md mx-auto rounded-xl shadow-xl mb-10"
            />
             <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
        <span className="text-white drop-shadow-[0_0_15px_rgba(255,0,255,0.75)]">Fulfill your fantasies</span>
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
                 Try The App
              </a>
              <a
                href="/subscribe"
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md shadow-gray-600/20 hover:scale-105"
              >
                 View Plans
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
          <section className="bg-[#0f0f11] text-white py-20 px-4 md:px-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
        A Simple, Powerful Process
      </h2>
      <p className="text-gray-400 text-center mb-12">
        Transform your images into captioned masterpieces in five easy steps.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`
              group rounded-xl border border-transparent 
              bg-[#1a1a1d] text-center p-6 h-full 
              transform transition-all duration-300
              hover:-translate-y-1 
              hover:border-${step.hoverColor} 
              hover:shadow-lg hover:${step.shadow}
            `}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-[#131316] p-3 rounded-lg">
                {step.icon}
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-gray-400">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
        <section className="bg-[#0f0f11] text-white py-16 px-6 md:px-12 lg:px-24">
      <h2 className="text-4xl font-bold text-center mb-4">Built for You</h2>
      <p className="text-center text-lg text-gray-400 mb-12">
        TexoticaCaptionAI helps you live out your fantasy
      </p>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left Side - Image or Animation */}
        <div className="bg-[#1c1c1e] rounded-xl min-h-[300px] flex items-center justify-center text-gray-400 text-lg border border-gray-700">
           <img
      src="/home.jpeg"
      alt="App preview"
      className="w-full h-full object-cover"
    />
        </div>

        {/* Right Side - Text Features */}
        <div className="space-y-8">
          <div>
            <h3 className="text-pink-400 text-xl font-semibold">Context-Aware Descriptions</h3>
            <p className="text-gray-300 mt-2">
              Our AI doesn't just see pixels; it understands context. From subtle glances to bold statements, it generates captions that truly match the mood of your image, handling a wide range of creative styles.
            </p>
          </div>

          <div>
            <h3 className="text-blue-400 text-xl font-semibold">Instant Text Overlays</h3>
            <p className="text-gray-300 mt-2">
              Why just generate a caption when you can embed it? The app seamlessly overlays the generated text onto your image, creating a finished product that's ready to post instantly.
            </p>
          </div>

          <div>
            <h3 className="text-green-400 text-xl font-semibold">SFW & NSFW Intelligence</h3>
            <p className="text-gray-300 mt-2">
              Designed with creators in mind, our AI is finely tuned to recognize content sensitivity, ensuring it provides fitting and appropriate descriptions whether your image is safe-for-work or artistically daring.
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Hero;
