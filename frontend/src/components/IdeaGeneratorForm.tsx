// --------------------------------------------------------------------------
// AutoGenesis: Phase 5, Step 5.2b - Secure Generator Form
//
// This is the FINAL step to secure the core app.
// 1. Connects to AuthContext to get the JWT token.
// 2. Sends the token in the Authorization header.
// 3. Upgrades all feedback to use react-hot-toast.
// --------------------------------------------------------------------------

import React, { useState, useRef, useEffect } from 'react';
import { animate } from 'animejs';
// --- NEW IMPORTS ---
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:8000';

const IdeaGeneratorForm: React.FC = () => {
    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const [responseMessage, setResponseMessage] = useState(...); // --- REMOVED (Replaced by toast)
    const formRef = useRef<HTMLDivElement>(null);
    // --- GET TOKEN FROM CONTEXT ---
    const { token, logout } = useAuth();

    useEffect(() => {
        // ... (animation logic remains the same) ...
        if (formRef.current) {
            animate(formRef.current, {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                easing: 'easeOutExpo',
            });
        }
    }, []);

    // --- Type-safe helper for auth headers ---
    const getAuthHeaders = (): Record<string, string> => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    };

    // --- UPDATED handleSubmit ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (idea.trim() === '' || isLoading || !token) {
             if (!token) {
                 toast.error("You must be logged in to generate an MVP.");
             }
            return;
        }

        setIsLoading(true);
        // setResponseMessage(null); // No longer needed
        
        // --- Show loading toast ---
        const loadingToast = toast.loading('EvoCore™ is initializing... This may take a moment.');

        try {
            const response = await fetch(`${API_URL}/api/generate`, {
                method: 'POST',
                headers: getAuthHeaders(), // Send the token
                body: JSON.stringify({ idea }),
            });

            const data = await response.json();

            if (response.status === 401) {
                toast.error('Session expired. Please log in again.');
                logout();
                return;
            }
            
            // Note: The new backend doesn't send 'success' or 'project_path'
            // It sends the full project object or an error.
            if (!response.ok) {
                throw new Error(data.detail || 'An unknown error occurred.');
            }

            // --- SUCCESS ---
            // Dismiss the loading toast and show success
            toast.dismiss(loadingToast);
            toast.success(`Project "${data.title}" saved to your dashboard!`);
            setIdea(''); // Clear the form on success

        } catch (error) {
            // --- FAILURE ---
            toast.dismiss(loadingToast);
            const errorMessage = error instanceof Error ? error.message : 'Failed to connect to the server.';
            toast.error(errorMessage);
            console.error("Error generating MVP:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div ref={formRef} className="w-full max-w-2xl mx-auto opacity-0">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
                Generate Your MVP
            </h2>
            <p className="text-slate-400 mb-8 text-center">
                Describe your startup idea, and let our AI agents build the foundation.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-lg">
                    <textarea
                        className="w-full h-40 p-4 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                        placeholder={token ? "e.g., An app that uses AI to create personalized workout plans..." : "Please log in to use the generator."}
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        disabled={isLoading || !token} // Disable if loading or not logged in
                    ></textarea>
                    <button
                        type="submit"
                        className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.5)] focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={isLoading || !idea.trim() || !token}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            'Generate'
                        )}
                    </button>
                </div>
            </form>
            {/* --- REMOVED responseMessage div --- */}
            {/* Toasts handle all feedback now */}
        </div>
    );
};

export default IdeaGeneratorForm;

// import React, { useState, useRef, useEffect } from 'react';
// import { animate } from 'animejs';

// const API_URL = 'http://127.0.0.1:8000';

// const IdeaGeneratorForm: React.FC = () => {
//   const [idea, setIdea] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [responseMessage, setResponseMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
//   const formRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (formRef.current) {
//       animate(
//         formRef.current,
//         {
//           opacity: [0, 1],
//           translateY: [20, 0],
//           duration: 800,
//           easing: 'easeOutExpo',
//         });
//     }
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (idea.trim() === '' || isLoading) return;

//     setIsLoading(true);
//     setResponseMessage(null);

//     try {
//       const response = await fetch(`${API_URL}/api/generate`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ idea }),
//       });

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data.message || 'An unknown error occurred.');
//       }

//       setResponseMessage({ type: 'success', text: `Success! Project generated at: ${data.project_path}` });
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to connect to the server.';
//       setResponseMessage({ type: 'error', text: errorMessage });
//       console.error("Error generating MVP:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div ref={formRef} className="w-full max-w-2xl mx-auto opacity-0">
//       <h2 className="text-3xl font-bold text-white mb-2 text-center">
//         Generate Your MVP
//       </h2>
//       <p className="text-slate-400 mb-8 text-center">
//         Describe your startup idea, and let our AI agents build the foundation.
//       </p>
//       <form onSubmit={handleSubmit}>
//         <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-lg">
//           <textarea
//             className="w-full h-40 p-4 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
//             placeholder="e.g., An app that uses AI to create personalized workout plans..."
//             value={idea}
//             onChange={(e) => setIdea(e.target.value)}
//             disabled={isLoading}
//           ></textarea>
//           <button
//             type="submit"
//             className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.5)] focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             disabled={isLoading || !idea.trim()}
//           >
//             {isLoading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating...
//               </>
//             ) : (
//               'Generate'
//             )}
//           </button>
//         </div>
//       </form>
//       {responseMessage && (
//         <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${responseMessage.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
//           {responseMessage.text}
//         </div>
//       )}
//     </div>
//   );
// };

// export default IdeaGeneratorForm;

