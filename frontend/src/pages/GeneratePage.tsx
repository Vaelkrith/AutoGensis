import React, { useState } from 'react';
import ToggleSwitch from '../components/ToggleSwitch';
import IdeaGeneratorForm from '../components/IdeaGeneratorForm';
import Chatbot from '../components/ChatbBot';

const GeneratePage: React.FC = () => {
  const [mode, setMode] = useState<'generator' | 'advisor'>('generator');

  return (
    <div className="container mx-auto px-4 pt-28 pb-12 min-h-screen">
      <ToggleSwitch mode={mode} setMode={setMode} />
      {mode === 'generator' ? (
        <div key="generator">
          <IdeaGeneratorForm />
        </div>
      ) : (
        <div key="advisor">
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default GeneratePage;
