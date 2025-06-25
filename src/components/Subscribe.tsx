import React from 'react';
import { BsCloudUpload, BsPencil, BsLightning, BsClipboard } from 'react-icons/bs';

const steps = [
  {
    title: '1. Upload With Ease',
    icon: <BsCloudUpload size={36} className="text-cyan-400" />,
    description:
      "Navigate to the 'App' page. Simply drag & drop your image onto the designated area, or click to browse your files. We support common formats like JPG, PNG, and WebP.",
    borderColor: 'border-cyan-400',
  },
  {
    title: '2. Define Your Fantasy',
    icon: <BsPencil size={36} className="text-pink-400" />,
    description:
      "Select your desired NSFW theme: Hotwife, Cuckold, SPH, JOI, Dares, Challenges, and more. Specify caption length, and input custom names, places, or specific words to weave into your erotic narrative.",
    borderColor: 'border-pink-400',
  },
  {
    title: '3. Ignite the AI & Perfect the Seduction',
    icon: <BsLightning size={36} className="text-purple-400" />,
    description:
      "Click 'Generate' and watch as our AI crafts a caption tailored to your desires. Review the outcome. Not quite right? Request variations or tweak it until it captures the heat and intimacy you envision.",
    borderColor: 'border-purple-400',
  },
  {
    title: '4. Claim Your Story',
    icon: <BsClipboard size={36} className="text-teal-400" />,
    description:
      "Satisfied with your creation? Copy your unique, AI-crafted NSFW caption. It's ready for your private enjoyment or to share within your trusted circles.",
    borderColor: 'border-teal-400',
  },
];

const HowItWorks = () => {
  return (
    <div className="bg-[#0d1117] min-h-screen text-white font-['Inter']">
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-center text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
          Ignite Your Imagination: Crafting Your NSFW Masterpiece
        </h1>
        <p className="text-center text-gray-400 max-w-3xl mx-auto text-lg mb-16">
          Ready to explore the art of seduction and storytelling? Follow these steps to create intensely personal and thrilling AI-generated captions for your images.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`bg-[#161b22] p-6 rounded-xl border-2 ${step.borderColor} transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-${step.borderColor.replace('border-', '')}/40`}
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
