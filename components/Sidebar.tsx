import React from 'react';
import { Domain } from '../types';
import { AppLogo } from './AppLogo';
import { 
  Home,
  Globe, 
  GraduationCap, 
  Eye, 
  Heart, 
  Briefcase, 
  Cpu, 
  MessageSquarePlus
} from 'lucide-react';

interface Props {
  activeDomain: Domain;
  onSelect: (domain: Domain) => void;
  onFeedback: () => void;
}

export const Sidebar: React.FC<Props> = ({ activeDomain, onSelect, onFeedback }) => {
  const menuItems = [
    { id: Domain.HOME, label: 'Home', icon: Home, color: 'text-white', bg: 'hover:bg-slate-700' },
    { id: Domain.SCIENCE, label: 'Science', icon: Globe, color: 'text-emerald-400', bg: 'hover:bg-emerald-500/10' },
    { id: Domain.EDUCATION, label: 'Education', icon: GraduationCap, color: 'text-amber-400', bg: 'hover:bg-amber-500/10' },
    { id: Domain.ACCESSIBILITY, label: 'Accessibility', icon: Eye, color: 'text-rose-400', bg: 'hover:bg-rose-500/10' },
    { id: Domain.HEALTH, label: 'Health', icon: Heart, color: 'text-red-400', bg: 'hover:bg-red-500/10' },
    { id: Domain.BUSINESS, label: 'Business', icon: Briefcase, color: 'text-indigo-400', bg: 'hover:bg-indigo-500/10' },
    { id: Domain.TECHNOLOGY, label: 'Technology', icon: Cpu, color: 'text-cyan-400', bg: 'hover:bg-cyan-500/10' },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0 transition-all duration-300">
      <button 
        onClick={() => onSelect(Domain.HOME)}
        className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors text-left"
      >
        <AppLogo size="md" />
        <div className="hidden lg:block">
          <span className="font-bold text-lg tracking-tight text-white">
            tHe<span className="text-blue-400">HoRiZon</span>
          </span>
        </div>
      </button>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeDomain === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group relative ${
                isActive 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : `text-slate-400 ${item.bg} hover:text-slate-200`
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? item.color : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className={`hidden lg:block font-medium ${isActive ? 'text-white' : ''} text-sm`}>
                {item.label}
              </span>
              
              {isActive && (
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${item.color === 'text-white' ? 'bg-blue-500' : item.color.replace('text-', 'bg-')}`}></div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800 hidden lg:block space-y-4">
        <button 
          onClick={onFeedback}
          className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700"
        >
          <MessageSquarePlus className="w-4 h-4" />
          Feedback
        </button>

        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            Powered by Google Gemini Models <br/> 
            <span className="opacity-50">2.5 Flash, 3 Pro Preview</span>
          </p>
        </div>
      </div>
    </aside>
  );
};