import React from 'react';

type Props = {
  title: string;
  price: string;
  original: string;
  period: string;
  features: string[];
  buttonLabel: string;
  color: 'blue' | 'pink';
  bestValue?: boolean;
};

const PricingCard: React.FC<Props> = ({
  title, price, original, period, features, buttonLabel, color, bestValue
}) => {
  const baseColor = color === 'blue' ? 'blue-500' : 'pink-500';

  return (
    <div className={`bg-[#161b22] rounded-2xl p-8 h-full flex flex-col 
      ${bestValue ? `border-2 border-${baseColor} shadow-2xl shadow-${baseColor}/20 scale-105` : 'border border-gray-700'} 
      hover:scale-110 transition-all duration-300 ease-in-out`}>
      
      {bestValue && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className={`bg-${baseColor} text-white text-xs font-bold px-4 py-1 rounded-full uppercase`}>
            Best Value
          </span>
        </div>
      )}

      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <div className="flex items-baseline mb-6">
        <span className="text-5xl font-bold tracking-tight">{price}</span>
        <span className="text-gray-400 ml-2 text-xl">{period}</span>
        <span className="text-gray-500 line-through ml-2">{original}</span>
      </div>
      <ul className="space-y-4 text-gray-300 mb-8 flex-grow">
        {features.map((f, i) => (
          <li key={i} className="flex items-center">
            <svg className={`w-5 h-5 text-${baseColor} mr-3`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 01.001 1.414l-8 8a1 1 0 01-1.415 0l-4-4a1 1 0 111.415-1.415L8 12.586l7.292-7.293a1 1 0 011.415 0z" clipRule="evenodd" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <button className={`w-full bg-${baseColor} hover:bg-${baseColor.replace('500', '600')} text-white font-bold py-3 px-4 rounded-lg transition-colors mt-auto`}>
        {buttonLabel}
      </button>
    </div>
  );
};

export default PricingCard;
