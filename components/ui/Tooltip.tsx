
import React, { useState } from 'react';

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {show && (
        <div className="absolute bottom-full mb-2 w-48 bg-slate-800 text-white text-xs rounded-md py-1.5 px-2.5 z-10">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
