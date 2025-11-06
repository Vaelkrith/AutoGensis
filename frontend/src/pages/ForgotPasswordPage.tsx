import React from 'react';

const ForgotPasswordPage: React.FC = () => {
    return (
        <div className="min-h-screen container mx-auto px-4 py-28 flex items-center justify-center">
            <div className="max-w-md w-full text-center">
                <h1 className="text-4xl font-extrabold text-white mb-4">
                    Reset Your Password
                </h1>
                <p className="text-slate-400 mb-8">
                    Reset Password 
                </p>
               
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 space-y-6 opacity-50">
                     <div>
                        <label 
                            htmlFor="email-placeholder" 
                            className="block text-sm font-medium text-slate-300 mb-2 text-left"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email-placeholder"
                            disabled
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 cursor-not-allowed"
                            placeholder="you@example.com"
                        />
                    </div>
                     <button 
                        type="button"
                        disabled
                        className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg text-lg cursor-not-allowed"
                    >
                        Send Reset Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;