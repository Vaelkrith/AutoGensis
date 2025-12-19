import React from 'react';

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="min-h-screen container mx-auto px-4 py-28">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-extrabold text-white mb-8">Terms of Service</h1>
                <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-4">
                    <p>Welcome to AutoGenesis! These terms and conditions outline the rules and regulations for the use of our website and services.</p>
                    <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use AutoGenesis if you do not agree to take all of the terms and conditions stated on this page.</p>
                    
                    <h2 className="text-3xl font-bold text-white">License</h2>
                    <p>Unless otherwise stated, AutoGenesis and/or its licensors own the intellectual property rights for all material on AutoGenesis. All intellectual property rights are reserved. You may access this from AutoGenesis for your own personal use subjected to restrictions set in these terms and conditions.</p>
                    <p>You must not:</p>
                    <ul className="list-disc pl-5">
                        <li>Republish material from AutoGenesis</li>
                        <li>Sell, rent or sub-license material from AutoGenesis</li>
                        <li>Reproduce, duplicate or copy material from AutoGenesis</li>
                        <li>Redistribute content from AutoGenesis</li>
                    </ul>
                    
                    <h2 className="text-3xl font-bold text-white">User Accounts</h2>
                    <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                    <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>
                    
                    <h2 className="text-3xl font-bold text-white">Disclaimer</h2>
                    <p>The materials on AutoGenesis's website are provided on an 'as is' basis. AutoGenesis makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;