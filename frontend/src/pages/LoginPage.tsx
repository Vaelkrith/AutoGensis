// --------------------------------------------------------------------------
// AutoGenesis: Phase 5 (Frontend), Task 2 - Replace Alerts with Toasts
//
// This update removes the 'error' state and replaces all user feedback
// with 'react-hot-toast' notifications.
// --------------------------------------------------------------------------

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// --- NEW IMPORT ---
import { toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:8000';

interface LoginPageProps {
    onNavigate: (path: string, state?: { [key: string]: any }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    // const [error, setError] = useState(''); // --- REMOVED (Replaced by toast)
    const [isLoading, setIsLoading] = useState(false);
    const [showResendOtp, setShowResendOtp] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // setError(''); // No longer needed
        setShowResendOtp(false);
        setIsLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403 && data.detail?.includes("Email not verified")) {
                    // --- REPLACE setError ---
                    toast.error(data.detail);
                    setShowResendOtp(true);
                } else {
                    throw new Error(data.detail || 'Login failed. Please check your credentials.');
                }
            } else {
                console.log("Login successful, received token data:", data);
                if (data.access_token) {
                    login(data.access_token);
                    // --- REPLACE ALERT ---
                    toast.success('Logged in successfully!');
                    onNavigate('/');
                } else {
                    throw new Error('Login successful, but no token received.');
                }
            }
        } catch (err) {
            // --- REPLACE setError ---
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            toast.error(message);
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        // setError(''); // No longer needed
        setShowResendOtp(false);

        try {
            const response = await fetch(`${API_URL}/api/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Failed to resend OTP.');
            
            // --- ADD SUCCESS TOAST ---
            toast.success(data.message || "New OTP sent!");
            onNavigate('/verify-otp', { email });

        } catch (err) {
            // --- REPLACE setError ---
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            toast.error(message);
            setShowResendOtp(true);
            console.error("Resend OTP error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen container mx-auto px-4 py-28 flex items-center justify-center">
            <div className="max-w-md w-full">
                <h1 className="text-4xl font-extrabold text-white text-center mb-8">
                    Welcome Back
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-800 p-8 rounded-xl border border-slate-700 space-y-6"
                >
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50" placeholder="you@example.com" />
                    </div>

                    {/* Password Input (with UI fix) */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
                            <button type="button" onClick={() => onNavigate('/forgot-password')} disabled={isLoading} className="text-sm text-sky-400 hover:text-sky-300 transition-colors disabled:opacity-50">Forgot Password?</button>
                        </div>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 pr-10 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50" placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-white disabled:opacity-50">
                                {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>}
                            </button>
                        </div>
                    </div>

                    {/* --- REMOVED {error && ...} --- */}
                    {/* Toasts handle all errors now */}

                    {/* Conditionally render Resend OTP button */}
                    {showResendOtp && (
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isLoading}
                            className="w-full text-center text-sm font-semibold text-sky-400 hover:text-sky-300 disabled:opacity-50"
                        >
                            Resend Verification OTP
                        </button>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors text-lg flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-6">
                    Don't have an account?{' '}
                    <button
                        onClick={() => onNavigate('/signup')}
                        disabled={isLoading}
                        className="font-semibold text-sky-400 hover:text-sky-300 disabled:opacity-50"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;