import React, { useEffect, useRef } from 'react';

const ProjectsPage: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.style.opacity = '1';
      pageRef.current.style.transition = 'opacity 0.8s ease-in-out';
    }
  }, []);

  const projects: any[] = []; 

  return (
    <div ref={pageRef} className="min-h-screen container mx-auto px-4 py-28" style={{ opacity: 0 }}>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold text-white">
          My Projects
        </h1>
        <button
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-110 shadow-[0_0_20px_rgba(56,189,248,0.5)] focus:scale-105 mb-8"
          onClick={() => onNavigate && onNavigate('/generate')}
        >
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl py-20">
          <h2 className="text-2xl font-bold text-white mb-2">No Projects Yet</h2>
          <p className="text-slate-400 mb-6">
            Click "New Project" to generate your first MVP.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* We will map over and display project cards here in the future */}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;

