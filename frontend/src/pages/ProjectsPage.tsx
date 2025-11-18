// --------------------------------------------------------------------------
// AutoGenesis: Phase 5, Step 5.4c - FIX "undefined" Project ID Bug
//
// This is the frontend half of the fix.
// 1. The 'Project' interface is updated to expect '_id' instead of 'id'.
// 2. All component logic (keys, download handlers) now uses 'project._id'.
// --------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:8000';

// --- THIS IS THE FIX (Part 1) ---
// The interface now expects '_id' to match the JSON from the API
interface Project {
    _id: string; // <-- WAS 'id'
    owner_id: string;
    idea: string;
    title: string | null;
    created_at: string;
}

const ProjectsPage: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // Add a new state to track which project is downloading
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const { token, logout } = useAuth();

    // Helper to create auth headers (for non-download requests)
    const getAuthHeaders = () => {
         return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    useEffect(() => {
        const fetchProjects = async () => {
            if (!token) return;
            
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/projects`, {
                    method: 'GET',
                    headers: getAuthHeaders()
                });

                if (response.status === 401) {
                    toast.error('Session expired. Please log in again.');
                    logout();
                    return;
                }
                if (!response.ok) {
                    throw new Error('Failed to fetch your projects.');
                }

                const data: Project[] = await response.json();
                setProjects(data); // Save the array of projects

            } catch (error) {
                console.error("Failed to fetch projects:", error);
                toast.error(error instanceof Error ? error.message : "Could not load projects.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, [token, logout]); // Re-run if token changes


    // --- NEW: FUNCTION TO HANDLE PROJECT DOWNLOAD ---
    const handleDownload = async (project: Project) => {
        if (!token) {
            toast.error("You are not logged in.");
            return;
        }
        
        // --- THIS IS THE FIX (Part 2) ---
        setDownloadingId(project._id); // Use _id
        toast.loading('Preparing your download...');

        try {
            // --- THIS IS THE FIX (Part 3) ---
            const response = await fetch(`${API_URL}/api/projects/${project._id}/download`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Send token for auth
                }
            });

            if (response.status === 401) {
                toast.dismiss();
                toast.error('Session expired. Please log in again.');
                logout();
                return;
            }
            if (!response.ok) {
                 throw new Error('Failed to download project.');
            }

            // Convert the response into a file (blob)
            const blob = await response.blob();
            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link element to trigger the download
            const a = document.createElement('a');
            a.href = url;
            const filename = `${project.title || 'autogenesis_project'}.zip`;
            a.download = filename; // Set the filename
            document.body.appendChild(a); // Add link to the page
            a.click(); // Programmatically click the link
            
            // Clean up
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            toast.dismiss();
            toast.success('Download started!');

        } catch (error) {
            console.error("Failed to download project:", error);
            toast.dismiss();
            toast.error(error instanceof Error ? error.message : "Could not download project.");
        } finally {
            setDownloadingId(null); // Clear loading state
        }
    };


    return (
        <div className="min-h-screen container mx-auto px-4 py-28">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-5xl font-extrabold text-white">
                    My Projects
                </h1>
                <button
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                    onClick={() => onNavigate && onNavigate('/generate')}
                >
                    + New Project
                </button>
            </div>

            {isLoading ? (
                // --- Loading Spinner ---
                <div className="flex justify-center items-center h-64">
                    <svg className="animate-spin h-10 w-10 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : projects.length === 0 ? (
                // --- Empty State ---
                <div className="text-center bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl py-20">
                    <h2 className="text-2xl font-bold text-white mb-2">No Projects Yet</h2>
                    <p className="text-slate-400 mb-6">
                        Click "+ New Project" to generate your first MVP.
                    </p>
                    <button
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
                        onClick={() => onNavigate && onNavigate('/generate')}
                    >
                        Start Generating
                    </button>
                </div>
            ) : (
                // --- Project Grid ---
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div 
                            // --- THIS IS THE FIX (Part 4) ---
                            key={project._id} // Use _id
                            className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden transition-all duration-300 hover:border-sky-500 hover:-translate-y-1 shadow-lg"
                        >
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-white mb-3 truncate">
                                    {project.title || "Untitled Project"}
                                </h3>
                                <p className="text-slate-400 h-24 overflow-hidden text-ellipsis">
                                    {project.idea}
                                </p>
                            </div>
                            <div className="border-t border-slate-700 p-4 mt-auto bg-slate-800/50 flex justify-between items-center">
                                <span className="text-xs text-slate-500">
                                    Created: {new Date(project.created_at).toLocaleDateString()}
                                </span>
                                
                                {/* --- UPDATED DOWNLOAD BUTTON --- */}
                                <button 
                                    onClick={() => handleDownload(project)}
                                    // --- THIS IS THE FIX (Part 5) ---
                                    disabled={downloadingId === project._id} // Use _id
                                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center disabled:opacity-50"
                                >
                                    {downloadingId === project._id ? (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
                                        </svg>
                                    )}
                                    Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;