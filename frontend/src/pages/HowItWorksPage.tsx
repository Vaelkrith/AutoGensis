import React, { useEffect, useRef } from 'react';

const HowItWorksPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.style.opacity = '1';
      pageRef.current.style.transition = 'opacity 0.8s ease-in-out';
    }
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen container mx-auto px-4 py-28 text-center" style={{ opacity: 0 }}>
      <h1 className="text-5xl font-extrabold text-white mb-4">
        How AutoGenesis Works
      </h1>
      <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-16">
        Transforming your idea into a functional MVP is a seamless, three-step process powered by our advanced AI agent system.
      </p>

      <div className="grid md:grid-cols-3 gap-8 text-left">

        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
          <div className="flex items-center mb-4">
            <div className="bg-sky-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl mr-4">1</div>
            <h2 className="text-2xl font-bold text-white">Submit Your Idea</h2>
          </div>
          <p className="text-slate-400">
            Start in the 'Generator' workspace. Describe your application idea in plain English. The more detail you provide about your vision, features, and target audience, the better our AI can understand and execute your plan.
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
          <div className="flex items-center mb-4">
            <div className="bg-sky-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl mr-4">2</div>
            <h2 className="text-2xl font-bold text-white">AI Agents Collaborate</h2>
          </div>
          <p className="text-slate-400">
            Once submitted, our EvoCore™ system activates. A team of specialized AI agents (Product, Design, Engineering) collaborates in a chain, analyzing your idea, creating a product plan, designing the UI, and writing the code.
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
          <div className="flex items-center mb-4">
            <div className="bg-sky-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl mr-4">3</div>
            <h2 className="text-2xl font-bold text-white">Download Your MVP</h2>
          </div>
          <p className="text-slate-400">
            After the generation is complete, you will be notified. Your fully-coded, functional Minimum Viable Product will be available for download from your 'Projects' dashboard, ready for you to run and deploy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;

