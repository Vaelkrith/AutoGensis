import React from 'react';
import { useAuth } from '../context/AuthContext'; 

const Header: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout(); 
        onNavigate && onNavigate('/'); 
    };

    return (
        <header className="bg-slate-900/80 text-white py-4 border-b border-slate-800 shadow-md sticky top-0 z-10 opacity-90 backdrop-blur-md" style={{ opacity: 0.95 }}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('/')}> 
                    <span className="text-sky-400 text-2xl font-extrabold tracking-tight">AutoGenesis</span>
                </div>
                <nav className="flex-1 flex justify-center">
                    <ul className="flex gap-8 text-lg font-medium">
                        <li><button className="hover:text-sky-400 transition-colors" onClick={() => onNavigate && onNavigate('/how-it-works')}>How It Works</button></li>
                        <li><button className="hover:text-sky-400 transition-colors" onClick={() => onNavigate && onNavigate('/generate')}>Generate</button></li>
                        <li><button className="hover:text-sky-400 transition-colors" onClick={() => onNavigate && onNavigate('/projects')}>Projects</button></li>
                        <li><button className="hover:text-sky-400 transition-colors" onClick={() => onNavigate && onNavigate('/pricing')}>Pricing</button></li>
                    </ul>
                </nav>
                
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <button 
                                className="text-slate-300 hover:text-white transition-colors text-base font-bold" 
                                onClick={() => onNavigate && onNavigate('/profile')}
                            >
                                Profile
                            </button>
                            <button 
                                className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg text-base transition-colors shadow focus:outline-none" 
                                onClick={handleLogout} 
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                className="text-slate-300 hover:text-white transition-colors text-base font-bold" 
                                onClick={() => onNavigate && onNavigate('/login')}
                            >
                                Sign In
                            </button>
                            <button 
                                className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg text-base transition-colors shadow focus:outline-none" 
                                onClick={() => onNavigate && onNavigate('/signup')}
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;