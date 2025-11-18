// --------------------------------------------------------------------------
// AutoGenesis: Phase 5 (Frontend), Task 2 - Replace Alerts with Toasts
//
// This update replaces all 'setError' calls with 'toast.error'
// for a consistent user experience.
// --------------------------------------------------------------------------

import React, { useState } from 'react';
// --- NEW IMPORT ---
import { toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:8000';

interface SignupPageProps {
    onNavigate: (path: string, state?: { [key: string]: any }) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [profession, setProfession] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // const [error, setError] = useState(''); // --- REMOVED (Replaced by toast)
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // --- REPLACE setError with toast.error ---
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (password.length < 8) {
             toast.error("Password must be at least 8 characters long.");
             return;
        }
        if (profession === '') {
            toast.error("Please select your profession.");
            return;
        }
        // setError(''); // No longer needed
        setIsLoading(true); 

        try {
            const requestBody = {
                name,
                email,
                password,
                age: age ? parseInt(age, 10) : null,
                profession
            };

            const response = await fetch(`${API_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                     // Handle potential validation errors from Beanie
                     const errorDetail = data.detail?.[0]?.msg || "Validation Error. Please check your fields.";
                     toast.error(errorDetail);
                } else {
                    throw new Error(data.detail || 'Signup failed. Please try again.');
                }
            } else {
                console.log("Signup successful, backend response:", data);
                // --- ADD SUCCESS TOAST ---
                toast.success('Account created! Please check your email to verify.');
                onNavigate('/verify-otp', { email: email }); 
            }

        } catch (err) {
            // --- REPLACE setError ---
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            toast.error(message);
            console.error("Signup error:", err);
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className="min-h-screen container mx-auto px-4 py-28 flex items-center justify-center">
            <div className="max-w-md w-full">
                <h1 className="text-4xl font-extrabold text-white text-center mb-8">
                    Create Your Account
                </h1>
                
                <form 
                    onSubmit={handleSubmit}
                    className="bg-slate-800 p-8 rounded-xl border border-slate-700 space-y-6"
                >
                    {/* --- Name Field --- */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50" placeholder="e.g., John Doe"/>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50" placeholder="you@example.com" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Age Field */}
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-slate-300 mb-2">Age (Optional)</label>
                            <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} min="1" disabled={isLoading} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50" placeholder="e.g., 25" />
                        </div>

                        {/* Profession Field (Dropdown) */}
                        <div>
                            <label htmlFor="profession" className="block text-sm font-medium text-slate-300 mb-2">Profession</label>
                            <select
                                id="profession"
                                value={profession}
                                onChange={(e) => setProfession(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50"
                            >
                                <option value="" disabled>Select one...</option>
                                <option value="developer">Developer / Engineer</option>
                                <option value="student">Student</option>
                                <option value="founder">Founder / Entrepreneur</option>
                                <option value="manager">Product / Project Manager</option>
                                <option value="designer">Designer (UI/UX)</option>
                                <option value="marketer">Marketing / Sales</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Password Field (with UI bug fix) */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} disabled={isLoading} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 pr-10 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50" placeholder="Minimum 8 characters" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-white">
                                {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field (with UI bug fix) */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                        <div className="relative">
                            <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 pr-10 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50" placeholder="••••••••" />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-white">
                                {showConfirmPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>}
                            </button>
                        </div>
                    </div>
                    
                    {/* --- REMOVED {error && ...} --- */}
                    {/* Toasts handle all errors now */}

                    <button 
                        type="submit"
                        disabled={isLoading} 
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-6">
                    Already have an account?{' '}
                    <button
                        onClick={() => onNavigate('/login')}
                        className="font-semibold text-sky-400 hover:text-sky-300"
                        disabled={isLoading} 
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;


// import React, { useState } from 'react';

// const API_URL = 'http://127.0.0.1:8000';

// interface SignupPageProps {
//     onNavigate: (path: string, state?: { [key: string]: any }) => void;
// }

// const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Separate state
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
        
//         if (password !== confirmPassword) {
//             setError("Passwords do not match.");
//             return;
//         }
//         if (password.length < 8) {
//              setError("Password must be at least 8 characters long.");
//              return;
//         }
//         setError('');
//         setIsLoading(true); 

//         try {
//             const response = await fetch(`${API_URL}/api/signup`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email, password }),
//             });
//             const data = await response.json();
//             if (!response.ok) {
//                 throw new Error(data.detail || 'Signup failed. Please try again.');
//             }
//             console.log("Signup successful, backend response:", data);
//             onNavigate('/verify-otp', { email: email }); 
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'An unknown error occurred during signup.');
//             console.error("Signup error:", err);
//         } finally {
//             setIsLoading(false); 
//         }
//     };

//     return (
//         <div className="min-h-screen container mx-auto px-4 py-28 flex items-center justify-center">
//             <div className="max-w-md w-full">
//                 <h1 className="text-4xl font-extrabold text-white text-center mb-8">
//                     Create Your Account
//                 </h1>
                
//                 <form 
//                     onSubmit={handleSubmit}
//                     className="bg-slate-800 p-8 rounded-xl border border-slate-700 space-y-6"
//                 >
//                     <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
//                         <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50" placeholder="you@example.com" />
//                     </div>

//                     <div>
//                         <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
//                         <div className="relative">
//                             <input 
//                                 type={showPassword ? 'text' : 'password'} 
//                                 id="password" 
//                                 value={password} 
//                                 onChange={(e) => setPassword(e.target.value)} 
//                                 required minLength={8} 
//                                 disabled={isLoading} 
//                                 className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50" 
//                                 placeholder="Minimum 8 characters" 
//                             />
//                             <button 
//                                 type="button" 
//                                 onClick={() => setShowPassword(!showPassword)} 
//                                 disabled={isLoading}
//                                 className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white disabled:opacity-50"
//                             >
//                                 {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>}
//                             </button>
//                         </div>
//                     </div>

//                     <div>
//                         <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
//                         <div className="relative">
//                             <input 
//                                 type={showConfirmPassword ? 'text' : 'password'} 
//                                 id="confirmPassword" 
//                                 value={confirmPassword} 
//                                 onChange={(e) => setConfirmPassword(e.target.value)} 
//                                 required 
//                                 disabled={isLoading} 
//                                 className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50" 
//                                 placeholder="••••••••" 
//                             />
//                             <button 
//                                 type="button" 
//                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
//                                 disabled={isLoading}
//                                 className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white disabled:opacity-50"
//                             >
//                                 {showConfirmPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>}
//                             </button>
//                         </div>
//                     </div>
                    
//                     {error && (
//                         <p className="text-sm text-red-400 text-center">{error}</p>
//                     )}

//                     <button 
//                         type="submit"
//                         disabled={isLoading} 
//                         className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {isLoading ? (
//                             <>
//                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                                 Creating Account...
//                             </>
//                         ) : (
//                             'Create Account'
//                         )}
//                     </button>
//                 </form>

//                 <p className="text-center text-slate-400 mt-6">
//                     Already have an account?{' '}
//                     <button
//                         onClick={() => onNavigate('/login')}
//                         className="font-semibold text-sky-400 hover:text-sky-300"
//                         disabled={isLoading} 
//                     >
//                         Sign In
//                     </button>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default SignupPage;