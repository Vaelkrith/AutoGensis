// --------------------------------------------------------------------------
// AutoGenesis: Phase 5, Step 5.2a - Secure Chatbot API Calls
//
// This update connects the Chatbot to the AuthContext to get the JWT token
// and sends it in the Authorization header for all API requests.
// It also uses react-hot-toast for errors.
// --------------------------------------------------------------------------

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { toast } from 'react-hot-toast'; // Import toast

const API_URL = 'http://127.0.0.1:8000';

// This interface matches our new backend models.py (ChatMessageDisplay)
interface Message {
    id: string; // MongoDB IDs are strings (PydanticObjectId)
    sender: 'user' | 'ai';
    text: string;
    timestamp: string; // Timestamps come as JSON strings
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // Get the token and logout function from our context
    const { token, logout } = useAuth();

    // Type-safe helper function to create authentication headers
    const getAuthHeaders = (): Record<string, string> => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    };

    // --- UPDATED fetchHistory to send token ---
    useEffect(() => {
        const fetchHistory = async () => {
            // Don't try to fetch if the token isn't loaded yet
            if (!token) {
                // This component is on a protected route, so if we're here
                // without a token, something is wrong.
                return; 
            }
            
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/chat/history`, {
                    method: 'GET',
                    headers: getAuthHeaders() // Send the token
                });
                
                if (response.status === 401) {
                    toast.error('Session expired. Please log in again.');
                    logout(); // Log out if token is invalid
                    return;
                }
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const history: Message[] = await response.json();
                setMessages(history);

            } catch (error) {
                console.error("Failed to fetch chat history:", error);
                toast.error("Sorry, I couldn't connect to the advisor.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [token, logout]); // Re-run if the token changes

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    // --- UPDATED handleSend to send token ---
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '' || isLoading || !token) return;

        // Create a temporary user message
        const userMessage: Message = { 
            id: Date.now().toString(), // Temporary string ID for React key
            sender: 'user', 
            text: input,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: getAuthHeaders(), // Send the token
                body: JSON.stringify({ question: currentInput }),
            });

            if (response.status === 401) {
                toast.error('Session expired. Please log in again.');
                logout(); // Log out if token is invalid
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to get a response from the server.');
            }

            // The API now returns a full Message object
            const aiResponse: Message = await response.json();
            // Replace the temporary user message with the real ones
            // (or just add the new AI one)
            setMessages(prev => [...prev, aiResponse]); 

        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Sorry, something went wrong. Please try again.");
            // Optionally remove the user's message if it failed to send
            setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col h-[70vh] bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                    {/* We now use the REAL database ID (a string) for the key */}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-4 py-3 rounded-2xl max-w-sm md:max-w-md ${msg.sender === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
                        // Show typing indicator only when AI is "replying"
                        <div className="flex items-end justify-start">
                            <div className="px-4 py-3 rounded-2xl max-w-sm md:max-w-md bg-slate-700 text-slate-200 rounded-bl-none">
                                <div className="flex items-center space-x-2">
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-4 border-t border-slate-700">
                <form onSubmit={handleSend} className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                        placeholder={token ? "Ask a question about your startup..." : "Please log in to use the advisor."}
                        autoComplete="off"
                        disabled={isLoading || !token}
                    />
                    <button type="submit" className="bg-sky-600 text-white p-3 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!input.trim() || isLoading || !token}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;