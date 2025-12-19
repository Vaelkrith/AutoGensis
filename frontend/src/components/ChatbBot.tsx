import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:8000';

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string; 
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { token, logout } = useAuth();

    
    const getAuthHeaders = (): Record<string, string> => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    };

    useEffect(() => {
        const fetchHistory = async () => {
            
            if (!token) {
                return; 
            }
            
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/chat/history`, {
                    method: 'GET',
                    headers: getAuthHeaders()
                });
                
                if (response.status === 401) {
                    toast.error('Session expired. Please log in again.');
                    logout();
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
    }, [token, logout]); 

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '' || isLoading || !token) return;

        const userMessage: Message = { 
            id: Date.now().toString(),
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
                headers: getAuthHeaders(),
                body: JSON.stringify({ question: currentInput }),
            });

            if (response.status === 401) {
                toast.error('Session expired. Please log in again.');
                logout();
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to get a response from the server.');
            }

            const aiResponse: Message = await response.json();
            setMessages(prev => [...prev, aiResponse]); 

        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Sorry, something went wrong. Please try again.");
            setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col h-[70vh] bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-4 py-3 rounded-2xl max-w-sm md:max-w-md ${msg.sender === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
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