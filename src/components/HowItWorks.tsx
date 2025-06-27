import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Edit, Zap, Copy } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Upload With Ease',
      desc: "Navigate to the 'App' page. Drag & drop or browse your image. JPG, PNG, and WebP are supported — secure and private.",
      Icon: UploadCloud,
      border: 'border-cyan-500',
      shadow: 'shadow-cyan-500/30'
    },
    {
      step: 2,
      title: 'Define Your Fantasy',
      desc: 'Pick a theme like Hotwife, Cuckold, SPH, Dares, Challenges. Add custom names or specific words into your erotic narrative.',
      Icon: Edit,
      border: 'border-pink-500',
      shadow: 'shadow-pink-500/30'
    },
    {
      step: 3,
      title: 'Ignite the AI & Perfect the Seduction',
      desc: "Click 'Generate' and let the AI do the work. Not satisfied? Try variations until it's perfect.",
      Icon: Zap,
      border: 'border-purple-500',
      shadow: 'shadow-purple-500/30'
    },
    {
      step: 4,
      title: 'Claim Your Story',
      desc: "Copy your finalized NSFW caption. It's ready for your personal enjoyment or trusted sharing.",
      Icon: Copy,
      border: 'border-teal-500',
      shadow: 'shadow-teal-500/30'
    },
  ];

  return (
    <div className="text-white font-inter bg-[#0d1117]">
      <main className="container mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Ignite Your Imagination: Crafting Your NSFW Masterpiece
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mt-4 max-w-3xl mx-auto">
            Explore the art of seduction and storytelling. Follow these steps to create intensely personal, AI-generated captions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map(({ step, title, desc, Icon, border, shadow }) => (
            <div
              key={step}
              className={`bg-[#161b22] p-6 rounded-xl border-2 ${border} transition-transform transform hover:scale-105 ${shadow} shadow-lg`}
            >
              <Icon className="text-4xl mb-4 text-current" />
              <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500">
                {step}. {title}
              </h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>

        <section className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { q: 'Is my content kept private?', a: 'Absolutely. Your privacy is our top priority. All uploaded images and generated captions are processed securely and are never stored on our servers or shared with anyone.' },
              { q: 'What kind of images can I use?', a: 'Our AI is designed to handle a wide spectrum of content, from safe-for-work (SFW) to not-safe-for-work (NSFW). We encourage creative freedom, but please ensure your content complies with legal standards.' },
              { q: "What if my image is 'too spicy' for the AI?", a: 'No problem. If our auto-recognition feature cant process your image, you will have the option to describe the scene yourself. This manual input ensures you can still get the perfect caption for any picture, no matter how unique or daring it is.' },
              { q: 'Can I customize the look of the text?', a: 'Yes! The app offers various customization options for text overlays. You can choose from different fonts, colors, sizes, and positioning to ensure the caption s visual style perfectly complements your image.' },
              { q: "What if I don't like the first caption?", a: 'No problem at all. You can generate multiple captions for a single image. Simply click the Generate button again, and our AI will provide a new, creative take based on your selected preferences.' },
            ].map(({ q, a }, idx) => (
              <details key={idx} className="step-card p-6 rounded-lg cursor-pointer border border-[#30363d] bg-[#161b22]">
                <summary className="font-semibold text-lg">{q}</summary>
                <p className="text-gray-400 mt-4">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-24 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Ready to Try it for free?
          </h3>
          <p className="text-gray-400 mt-2 max-w-xl mx-auto">
            Explore our subscription plans and enjoy Texotica Caption AI!
          </p>
          <Link to="/subscribe" className="mt-8 inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            View Subscription Plans
          </Link>
        </section>
      </main>

      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          &copy; 2025 Texotica Caption AI. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
