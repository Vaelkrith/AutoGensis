import React, { useEffect, useRef } from 'react';

const PricingPage: React.FC = () => {
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
        Find the Perfect Plan
      </h1>
      <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-16">
        Start for free and scale as you grow. Our plans are designed to fit the needs of every innovator, from solo founders to large enterprises.
      </p>
      <div className="grid md:grid-cols-3 gap-8 text-left">
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-2">Hobby</h2>
          <p className="text-slate-400 mb-6">For individuals and enthusiasts getting started.</p>
          <p className="text-4xl font-bold text-white mb-6">$0<span className="text-lg font-normal text-slate-400">/month</span></p>
          <ul className="text-slate-300 space-y-3 mb-8 flex-grow">
            <li className="flex items-center"><span className="text-sky-400 mr-2">✔</span> 5 MVP Generations / month</li>
            <li className="flex items-center"><span className="text-sky-400 mr-2">✔</span> Basic AI Advisor Access</li>
            <li className="flex items-center"><span className="text-sky-400 mr-2">✔</span> Community Support</li>
          </ul>
          <button className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-colors">Get Started</button>
        </div>
        <div className="bg-slate-800 p-8 rounded-xl border-2 border-sky-500 flex flex-col relative">
           <div className="absolute top-0 right-0 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">MOST POPULAR</div>
          <h2 className="text-2xl font-bold text-sky-400 mb-2">Pro</h2>
          <p className="text-slate-400 mb-6">For professionals and small teams building businesses.</p>
          <p className="text-4xl font-bold text-white mb-6">$49<span className="text-lg font-normal text-slate-400">/month</span></p>
          <ul className="text-slate-300 space-y-3 mb-8 flex-grow">
            <li className="flex items-center"><span className="text-sky-400 mr-2">✔</span> 50 MVP Generations / month</li>
            <li className="flex items-center"><span className="text-sky-400 mr-2">✔</span> Advanced AI Advisor Access</li>
            <li className="flex items-center"><span className="text-sky-400 mr-2">✔</span> Full-Stack Generation (Coming Soon)</li>
            <li className="flex items-center"><span className="text-sky-400 mr-2">✔</span> Priority Email Support</li>
          </ul>
          <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors">Choose Pro</button>
        </div>
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-2">Enterprise</h2>
          <p className="text-slate-400 mb-6">For large organizations requiring advanced features.</p>
          <p className="text-4xl font-bold text-white mb-6">Contact Us</p>
          <ul className="text-slate-300 space-y-3 mb-8 flex-grow">
            <li className="flex items-center"><span className="text-sky-400 mr-2">✔</span> Unlimited MVP Generations</li>
            <li className="flex items-center"><span className="text-sky-400 mr-2">✔</span> Dedicated AI Advisor</li>
            <li className="flex items-center"><span className="text-sky-400 mr-2">✔</span> On-Premise Deployment Options</li>
            <li className="flex items-center"><span className="text-sky-400 mr-2">✔</span> 24/7 Dedicated Support</li>
          </ul>
          <button className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-colors">Contact Sales</button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

