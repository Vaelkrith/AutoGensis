// --------------------------------------------------------------------------
// AutoGenesis: Phase 6 - Update Footer Links
//
// This update adds real links to the social icons and connects
// the text links to the new pages via the 'onNavigate' prop.
// --------------------------------------------------------------------------

import React from 'react';
import { Github, Linkedin } from 'lucide-react'; // Removed Twitter

const Footer: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
    
    const handleNavClick = (path: string) => {
        if (onNavigate) {
            onNavigate(path);
        }
    };
    
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* --- Column 1: Brand & Socials --- */}
                    <div className="col-span-2 md:col-span-1">
                        <h2 className="text-2xl font-bold text-white mb-2">AutoGenesis</h2>
                        <p className="text-sm">Automated MVP Generation.</p>

                        <div className="flex space-x-4 mt-4">
                            {/* --- GITHUB LINK (UPDATED) --- */}
                            <a 
                                href="https://github.com/Vaelkrith" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:text-white transition-colors"
                                aria-label="GitHub Profile"
                            >
                                <Github size={20} />
                            </a>
                            {/* --- LINKEDIN LINK (UPDATED) --- */}
                            <a 
                                href="https://www.linkedin.com/in/bhavyan-gupta-aa7617211" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:text-white transition-colors"
                                aria-label="LinkedIn Profile"
                            >
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                    
                    {/* --- Column 2: Product Links --- */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
                            Product
                        </h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <button
                                    className="text-sm hover:text-white transition-colors text-left w-full"
                                    onClick={() => handleNavClick('/how-it-works')}
                                >
                                    How It Works
                                </button>
                            </li>
                            <li>
                                <button
                                    className="text-sm hover:text-white transition-colors text-left w-full" 
                                    onClick={() => handleNavClick('/pricing')}
                                >
                                    Pricing
                                </button>
                            </li>
                            <li>
                                <button
                                    className="text-sm hover:text-white transition-colors text-left w-full"
                                    onClick={() => handleNavClick('/projects')}
                                >
                                    Projects
                                </button>
                            </li>
                        </ul>
                    </div>
                    
                    {/* --- Column 3: Company Links (UPDATED) --- */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
                            Company
                        </h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <button
                                    className="text-sm hover:text-white transition-colors text-left w-full"
                                    onClick={() => handleNavClick('/about')}
                                >
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button
                                    className="text-sm hover:text-white transition-colors text-left w-full"
                                    onClick={() => handleNavClick('/contact')}
                                >
                                    Contact
                                </button>
                            </li>
                        </ul>
                    </div>
                    
                    {/* --- Column 4: Legal Links (UPDATED) --- */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
                            Legal
                        </h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <button
                                    className="text-sm hover:text-white transition-colors text-left w-full"
                                    onClick={() => handleNavClick('/privacy')}
                                >
                                    Privacy Policy
                                </button>
                            </li>
                            <li>
                                <button
                                    className="text-sm hover:text-white transition-colors text-left w-full"
                                    onClick={() => handleNavClick('/terms')}
                                >
                                    Terms of Service
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm">
                    <p>
                        &copy; {new Date().getFullYear()} AutoGenesis. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;