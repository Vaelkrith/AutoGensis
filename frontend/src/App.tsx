import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import GeneratePage from './pages/GeneratePage';
import HowItWorksPage from './pages/HowItWorksPage';
import PricingPage from './pages/PricingPage';
import ProjectsPage from './pages/ProjectsPage';
import ProfilePage from './pages/ProfilePage';
import DynamicBackground from './components/DynamicBackground';
import TechPointer from './components/TechPointer';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

function App() {
    const [currentPage, setCurrentPage] = useState('/');
    const [emailForVerification, setEmailForVerification] = useState<string | null>(null);
    const { isAuthenticated, isLoading } = useAuth();

    const navigate = (path: string, state?: { [key: string]: any }) => {
        if (path === '/verify-otp' && state?.email) {
            setEmailForVerification(state.email);
        } else if (path !== '/verify-otp') { 
            setEmailForVerification(null);
        }
        setCurrentPage(path);
        window.scrollTo(0, 0);
    };

    if (isLoading) {
        return (
            <div className="bg-slate-900 text-white min-h-screen font-sans flex flex-col items-center justify-center">
                <svg className="animate-spin h-10 w-10 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    const renderPage = () => {
        const isProtected = ['/generate', '/projects', '/profile'].includes(currentPage);
        const isAuthRoute = ['/login', '/signup', '/verify-otp', '/forgot-password'].includes(currentPage);

        if (isProtected && !isAuthenticated) {
            return <LoginPage onNavigate={navigate} />;
        }
        if (isAuthRoute && isAuthenticated) {
            return <HomePage onNavigate={navigate} />;
        }

        switch (currentPage) {
            case '/': return <HomePage onNavigate={navigate} />;
            case '/generate': return <GeneratePage />;
            case '/how-it-works': return <HowItWorksPage />;
            case '/pricing': return <PricingPage />;
            case '/projects': return <ProjectsPage onNavigate={navigate} />;
            case '/profile': return <ProfilePage />;
            
            case '/signup': return <SignupPage onNavigate={navigate} />;
            case '/login': return <LoginPage onNavigate={navigate} />;
            case '/verify-otp': 
                return emailForVerification 
                    ? <VerifyOtpPage onNavigate={navigate} email={emailForVerification} /> 
                    : <LoginPage onNavigate={navigate} />;
            case '/forgot-password': return <ForgotPasswordPage />;
            
            case '/about': return <AboutUsPage />;
            case '/contact': return <ContactPage />;
            case '/terms': return <TermsOfServicePage />;
            case '/privacy': return <PrivacyPolicyPage />;

            default: return <HomePage onNavigate={navigate} />;
        }
    };

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans flex flex-col cursor-none">
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: '#334155', 
                        color: '#f1f5f9',
                        border: '1px solid #475569',
                    },
                }}
            />
            
            <TechPointer />
            <DynamicBackground />
            <Header onNavigate={navigate} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <Footer onNavigate={navigate} />
        </div>
    );
}

export default App;