import React, { useState } from 'react';
import { Domain } from './types';
import { Sidebar } from './components/Sidebar';
import { FeedbackModal } from './components/FeedbackModal';
import { HomeView } from './features/HomeView';
import { ScienceView } from './features/ScienceView';
import { EducationView } from './features/EducationView';
import { AccessibilityView } from './features/AccessibilityView';
import { HealthView } from './features/HealthView';
import { BusinessView } from './features/BusinessView';
import { TechnologyView } from './features/TechnologyView';

const App = () => {
  const [activeDomain, setActiveDomain] = useState<Domain>(Domain.HOME);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const renderContent = () => {
    switch (activeDomain) {
      case Domain.HOME: return <HomeView onNavigate={setActiveDomain} />;
      case Domain.SCIENCE: return <ScienceView />;
      case Domain.EDUCATION: return <EducationView />;
      case Domain.ACCESSIBILITY: return <AccessibilityView />;
      case Domain.HEALTH: return <HealthView />;
      case Domain.BUSINESS: return <BusinessView />;
      case Domain.TECHNOLOGY: return <TechnologyView />;
      default: return <HomeView onNavigate={setActiveDomain} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden text-slate-50 font-sans selection:bg-blue-500/30">
      <Sidebar 
        activeDomain={activeDomain} 
        onSelect={setActiveDomain} 
        onFeedback={() => setIsFeedbackOpen(true)}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0f172a] to-transparent pointer-events-none z-10"></div>
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 z-0">
          {renderContent()}
        </div>
      </main>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </div>
  );
};

export default App;