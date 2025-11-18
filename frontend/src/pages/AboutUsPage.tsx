// --------------------------------------------------------------------------
// AutoGenesis: Phase 6 - Add About Us Page
// --------------------------------------------------------------------------
import React from 'react';

const AboutUsPage: React.FC = () => {
    return (
        <div className="min-h-screen container mx-auto px-4 py-28">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-white mb-8">About AutoGenesis</h1>
                <p className="text-xl text-slate-300 mb-12">
                    We believe that a great idea shouldn't be limited by technical barriers.
                    Our mission is to empower entrepreneurs, developers, and creators to
                    build and validate their visions faster than ever before.
                </p>
                
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                    <h2 className="text-3xl font-bold text-white mb-4">The "EvoCore™"</h2>
                    <p className="text-lg text-slate-300">
                        AutoGenesis is powered by EvoCore™, our proprietary agentic workflow.
                        It's not just a single AI, but a collaborative team of specialized AI agents
                        that mimic a real-world product team. Our Product Manager agent defines the
                        strategy, our Designer agent plans the UI, and our Engineering agent
                        writes the code. This unique, multi-step process ensures a much higher
                        quality and more comprehensive output than any single-prompt generator.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;