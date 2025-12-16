import React from 'react';

interface GlitchTextProps {
  text: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '9xl';
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '' }) => {
  return (
    <div className={`relative group inline-block ${className}`}>
      {/* Base Text - Always Visible */}
      <span className="relative z-10 group-hover:text-cyan-400 transition-colors duration-200">{text}</span>
      
      {/* Red Shift Layer */}
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-[2px] md:group-hover:translate-x-[3px] transition-all duration-100 select-none mix-blend-screen">
        {text}
      </span>
      
      {/* Blue Shift Layer */}
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-blue-500 opacity-0 group-hover:opacity-100 group-hover:-translate-x-[2px] md:group-hover:-translate-x-[3px] transition-all duration-100 select-none mix-blend-screen">
        {text}
      </span>
    </div>
  );
};

export default GlitchText;
