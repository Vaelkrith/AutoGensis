
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 

const API_URL = 'http://127.0.0.1:8000'; 

interface VerifyOtpPageProps {
    onNavigate: (path: string) => void;
    email: string; 
}

const VerifyOtpPage: React.FC<VerifyOtpPageProps> = ({ onNavigate, email }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const { login } = useAuth(); 

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'OTP verification failed.');
            }

           
            console.log("OTP Verification successful, received token data:", data);
            if (data.access_token) {
                login(data.access_token);
                onNavigate('/'); 
            } else {
               
                 throw new Error('Verification successful, but no token received.');
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error("OTP Verification error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
             const response = await fetch(`${API_URL}/api/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

             if (!response.ok) {
                throw new Error(data.detail || 'Failed to resend OTP.');
            }
            setSuccessMessage(data.message || "New OTP sent successfully.");

        } catch (err) {
             setError(err instanceof Error ? err.message : 'An unknown error occurred.');
             console.error("Resend OTP error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen container mx-auto px-4 py-28 flex items-center justify-center">
            <div className="max-w-md w-full">
                <h1 className="text-4xl font-extrabold text-white text-center mb-4">
                    Verify Your Email
                </h1>
                <p className="text-slate-400 text-center mb-8">
                    We sent a 6-digit code to <span className="font-medium text-sky-400">{email}</span>. Please enter it below.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-800 p-8 rounded-xl border border-slate-700 space-y-6"
                >
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-slate-300 mb-2 sr-only">One-Time Password</label>
                        <input
                            ref={inputRef}
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            required
                            maxLength={6}
                            disabled={isLoading}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white text-center text-2xl tracking-[0.5em] placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50"
                            placeholder="------"
                        />
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    {successMessage && <p className="text-sm text-green-400 text-center">{successMessage}</p>}


                    <button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors text-lg flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Verify Code'}
                    </button>
                </form>

                 <p className="text-center text-slate-400 mt-6">
                    Didn't receive the code?{' '}
                    <button
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="font-semibold text-sky-400 hover:text-sky-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Resend OTP
                    </button>
                </p>
            </div>
        </div>
    );
};

export default VerifyOtpPage;