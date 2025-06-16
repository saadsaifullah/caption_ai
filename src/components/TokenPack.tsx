import React from 'react';

type Props = {
  title: string;
  subtext: string;
  price: string;
  original: string;
  button: string;
  onClick?: () => void; // ✅ Add onClick
};

const TokenPack: React.FC<Props> = ({ title, subtext, price, original, button, onClick }) => (
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700">
    <p className="font-semibold text-lg">{title}</p>
    <p className="text-gray-400 text-sm mb-3">{subtext}</p>
    <div className="flex items-baseline mb-3">
      <span className="text-2xl font-bold tracking-tight">{price}</span>
      <span className="text-gray-500 line-through ml-2">{original}</span>
    </div>
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
    >
      {button}
    </button>
  </div>
);

export default TokenPack;
