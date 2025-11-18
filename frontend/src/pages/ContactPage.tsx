// --------------------------------------------------------------------------
// AutoGenesis: Phase 6 - Add Contact Page
// --------------------------------------------------------------------------
import React from 'react';

const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen container mx-auto px-4 py-28">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-extrabold text-white mb-8">Contact Us</h1>
                <p className="text-lg text-slate-300 mb-6">
                    We'd love to hear from you! Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
                </p>
                
                {/* This is a simple placeholder form. It doesn't send data yet. */}
                <form className="bg-slate-800 p-8 rounded-xl border border-slate-700 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                            <input type="text" id="name" required className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition" placeholder="Your Name" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input type="email" id="email" required className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition" placeholder="you@example.com" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                        <input type="text" id="subject" required className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition" placeholder="What's this about?" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                        <textarea id="message" rows={6} required className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition" placeholder="Your message..."></textarea>
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors text-lg"
                        onClick={(e) => { e.preventDefault(); alert("Message sent! (Placeholder)"); }}
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;