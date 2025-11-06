import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface ToggleSwitchProps {
  mode: 'generator' | 'advisor';
  setMode: (mode: 'generator' | 'advisor') => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ mode, setMode }) => {
  const isAdvisorMode = mode === 'advisor';
  const knobRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (knobRef.current) {
      animate(
        knobRef.current,
        {
          translateX: isAdvisorMode ? '28px' : '4px',
          duration: 800,
          easing: 'spring(1, 80, 10, 0)',
        }
      );
    }

    if (backgroundRef.current) {
      animate(
        backgroundRef.current,
        {
          backgroundColor: isAdvisorMode ? '#0ea5e9' : '#334155',
          duration: 400,
          easing: 'easeOutQuad',
        }
      );
    }

  }, [isAdvisorMode]);

  return (
    <div className="flex items-center justify-center space-x-4 mb-12">
      <span className={`font-semibold transition-colors duration-300 ${!isAdvisorMode ? 'text-sky-400' : 'text-slate-500'}`}>
        Generator
      </span>
      <label htmlFor="mode-toggle" className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id="mode-toggle"
          className="sr-only"
          checked={isAdvisorMode}
          onChange={() => setMode(isAdvisorMode ? 'generator' : 'advisor')}
        />
        <div ref={backgroundRef} className="w-14 h-7 bg-slate-700 rounded-full relative flex items-center p-1">
          <div ref={knobRef} className="w-5 h-5 bg-white rounded-full shadow-md absolute" />
        </div>
      </label>
      <span className={`font-semibold transition-colors duration-300 ${isAdvisorMode ? 'text-sky-400' : 'text-slate-500'}`}>
        Advisor
      </span>
    </div>
  );
};

export default ToggleSwitch;
