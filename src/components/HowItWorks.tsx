import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Upload With Ease',
      desc: "Navigate to the 'App' page. Drag & drop or browse your image. JPG, PNG, and WebP are supported — secure and private.",
      icon: '⬆️',
      border: 'border-cyan-500',
      shadow: 'shadow-cyan-500/30'
    },
    {
      step: 2,
      title: 'Define Your Fantasy',
      desc: 'Pick a theme like Hotwife, Cuckold, SPH, Dares, Challenges. Add custom names or specific words into your erotic narrative.',
      icon: '📝',
      border: 'border-pink-500',
      shadow: 'shadow-pink-500/30'
    },
    {
      step: 3,
      title: 'Ignite the AI & Perfect the Seduction',
      desc: "Click 'Generate' and let the AI do the work. Not satisfied? Try variations until it's perfect.",
      icon: '⚡',
      border: 'border-purple-500',
      shadow: 'shadow-purple-500/30'
    },
    {
      step: 4,
      title: 'Claim Your Story',
      desc: "Copy your finalized NSFW caption. It's ready for your personal enjoyment or trusted sharing.",
      icon: '📋',
      border: 'border-teal-500',
      shadow: 'shadow-teal-500/30'
    },
  ];

  return (
    <div className="text-white font-inter bg-[#0d1117]">
      <main className="container mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Ignite Your Imagination: Crafting Your NSFW Masterpiece
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mt-4 max-w-3xl mx-auto">
            Explore the art of seduction and storytelling. Follow these steps to create intensely personal, AI-generated captions.
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`bg-[#161b22] p-6 rounded-xl border-2 ${step.border} transition-transform transform hover:scale-105 hover:${step.shadow} shadow-lg`}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500">
                {step.step}. {step.title}
              </h3>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section (unchanged) */}
        <section className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                q: 'Is my content kept private?',
                a: 'Absolutely. Your privacy is our top priority...'
              },
              {
                q: 'What kind of images can I use?',
                a: 'Our AI is designed to handle a wide spectrum of content...'
              },
              {
                q: "What if my image is 'too spicy' for the AI?",
                a: 'You can describe the scene manually...'
              },
              {
                q: 'Can I customize the look of the text?',
                a: 'Yes! Choose from different fonts, colors, sizes, and positions...'
              },
              {
                q: "What if I don't like the first caption?",
                a: 'Generate as many captions as you like...'
              },
            ].map(({ q, a }, i) => (
              <details key={i} className="step-card p-6 rounded-lg cursor-pointer border border-[#30363d] bg-[#161b22]">
                <summary className="font-semibold text-lg">{q}</summary>
                <p className="text-gray-400 mt-4">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Ready to Try it for free?</h3>
          <p className="text-gray-400 mt-2 max-w-xl mx-auto">
            Explore our subscription plans and enjoy Texotica Caption AI!
          </p>
          <Link to="/subscribe" className="mt-8 inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            View Subscription Plans
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          &copy; 2025 Texotica Caption AI. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
