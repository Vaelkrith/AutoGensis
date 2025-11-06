import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { animate, createScope } from 'animejs';

const FeatureIcon = ({ d }: { d: string }) => (
  <svg className="w-12 h-12 mb-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

const HomePage: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
  const heroRef = useRef(null);

  const { ref: featuresInViewRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const scope = createScope({ root: heroRef });
    scope.add(() => {
      animate('.hero-container', {
        opacity: [0, 1],
        translateY: [60, 0],
        duration: 900,
        easing: 'easeOutExpo',
      });
      animate('.hero-element', {
        translateY: [50, 0],
        opacity: [0, 1],
        delay: 200,
        duration: 800,
        easing: 'easeOutExpo',
      });
      animate('.hero-btn', {
        scale: [0.8, 1],
        opacity: [0, 1],
        delay: 900,
        duration: 600,
        easing: 'easeOutBack',
      });
      animate('.gradient-shimmer', {
        backgroundPositionX: ['0%', '100%'],
        duration: 2000,
        direction: 'alternate',
        loop: true,
        easing: 'linear',
      });
    });
    return () => scope.revert();
  }, []);

  useEffect(() => {
    if (featuresInView) {
      const featuresSection = document.querySelector('.features-heading')?.closest('section');
      if (!featuresSection) return;
      const scope = createScope({ root: { current: featuresSection } });
      scope.add(() => {
        animate('.features-heading', {
          translateY: [40, 0],
          opacity: [0, 1],
          duration: 700,
          easing: 'easeOutExpo',
        });
        animate('.feature-card', {
          translateY: [60, 0],
          opacity: [0, 1],
          rotateZ: [6, 0],
          scale: [0.95, 1],
          delay: 400,
          duration: 900,
          easing: 'easeOutBack',
        });
      });
      return () => scope.revert();
    }
  }, [featuresInView]);

  return (
    <div>
      <section ref={heroRef} className="h-screen flex items-center justify-center text-center pt-20 overflow-hidden">
        <div className="container mx-auto px-4 hero-container opacity-0">
          <h1 className="hero-element text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 opacity-0">
            Build Your Startup, <br />
            <span
              className="gradient-shimmer bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #38bdf8 0%, #67e8f9 50%, #38bdf8 100%)',
                backgroundSize: '200% auto',
                backgroundPositionX: '0%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Not Just The Code.
            </span>
          </h1>
          <p className="hero-element text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-8 opacity-0">
            AutoGenesis is an agentic AI system that transforms your ideas into functional MVPs, complete with business plans and market analysis.
          </p>
          <div className="opacity-0 hero-btn">
            <button
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-110 shadow-[0_0_20px_rgba(56,189,248,0.5)] focus:scale-105"
              onClick={() => onNavigate && onNavigate('/generate')}
            >
              Start Generating
            </button>
          </div>
        </div>
      </section>
      <section ref={featuresInViewRef} className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="features-heading text-4xl font-bold text-white mb-16 opacity-0">
            An Agentic AI-Powered Workflow
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card opacity-0 bg-slate-800 p-8 rounded-xl border border-slate-700 transition-all duration-300 hover:border-sky-500 hover:-translate-y-2 hover:scale-105 cursor-pointer">
              <FeatureIcon d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              <h3 className="text-2xl font-bold text-white mb-2">Idea Analysis</h3>
              <p className="text-slate-400">Go beyond code. Get comprehensive business plans, market research, and monetization strategies for your startup idea.</p>
            </div>
            <div className="feature-card opacity-0 bg-slate-800 p-8 rounded-xl border border-slate-700 transition-all duration-300 hover:border-sky-500 hover:-translate-y-2 hover:scale-105 cursor-pointer">
              <FeatureIcon d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              <h3 className="text-2xl font-bold text-white mb-2">MVP Generation</h3>
              <p className="text-slate-400">From a single line of text, our AI agents collaborate to design, code, and structure a functional Streamlit MVP for you.</p>
            </div>
            <div className="feature-card opacity-0 bg-slate-800 p-8 rounded-xl border border-slate-700 transition-all duration-300 hover:border-sky-500 hover:-translate-y-2 hover:scale-105 cursor-pointer">
              <FeatureIcon d="M13 10V3L4 14h7v7l9-11h-7z" />
              <h3 className="text-2xl font-bold text-white mb-2">Live Previews</h3>
              <p className="text-slate-400">Instantly preview and interact with your generated applications in a live environment, allowing for rapid testing and iteration.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
