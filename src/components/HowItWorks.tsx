import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  return (
    <div className="text-white font-inter bg-[#0d1117]">
      {/* Header */}
  

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">How It Works</h2>
          <p className="text-lg md:text-xl text-gray-400 mt-4 max-w-3xl mx-auto">
            Unleash your creativity with our simple and intuitive caption generation process.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto space-y-12">
          {[
            {
              step: 1,
              title: 'Upload Your Image',
              desc: 'Begin by selecting an image from your device... secure and private.',
              color: 'blue'
            },
            {
              step: 2,
              title: 'Let the AI Analyze',
              desc: 'Our powerful AI gets to work... make your picture unique.',
              color: 'pink'
            },
            {
              step: 3,
              title: 'Choose Your Style & Preferences',
              desc: 'Dive into a vast selection of themes... perfectly match your fantasy.',
              color: 'amber'
            },
            {
              step: 4,
              title: 'Generate & Refine',
              desc: "With your preferences set... explore different creative angles.",
              color: 'teal'
            },
            {
              step: 5,
              title: 'Download Your Creation',
              desc: "The app overlays your caption... ready to download and share.",
              color: 'purple'
            },
          ].map(({ step, title, desc, color }, index) => (
            <div key={step} className={`md:flex items-center ${index % 2 === 1 ? 'flex-row-reverse' : ''} gap-8`}>
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className={`flex items-center justify-center h-24 w-24 rounded-full bg-${color}-500/10 text-${color}-400 mx-auto border-2 border-${color}-500`}>
                  <span className="text-4xl font-bold">{step}</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">{title}</h3>
                <p className="text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
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
          <Link to="/pricing" className="mt-8 inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
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
