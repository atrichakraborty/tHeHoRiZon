import React from 'react';
import { Domain } from '../types';
import { AppLogo } from '../components/AppLogo';
import { 
  Globe, 
  GraduationCap, 
  Eye, 
  Heart, 
  Briefcase, 
  Cpu, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface Props {
  onNavigate: (domain: Domain) => void;
}

export const HomeView: React.FC<Props> = ({ onNavigate }) => {
  const features = [
    { 
      id: Domain.SCIENCE, 
      title: 'Science', 
      desc: 'Accelerate discovery and research',
      icon: Globe, 
      color: 'text-emerald-400',
      border: 'hover:border-emerald-500/50',
      bg: 'hover:bg-emerald-500/10',
      shadow: 'hover:shadow-emerald-500/20'
    },
    { 
      id: Domain.EDUCATION, 
      title: 'Education', 
      desc: 'Reimagine learning with personalized, adaptive explanations',
      icon: GraduationCap, 
      color: 'text-amber-400',
      border: 'hover:border-amber-500/50',
      bg: 'hover:bg-amber-500/10',
      shadow: 'hover:shadow-amber-500/20'
    },
    { 
      id: Domain.ACCESSIBILITY, 
      title: 'Accessibility', 
      desc: 'Build tools that work for everyone',
      icon: Eye, 
      color: 'text-rose-400',
      border: 'hover:border-rose-500/50',
      bg: 'hover:bg-rose-500/10',
      shadow: 'hover:shadow-rose-500/20'
    },
    { 
      id: Domain.HEALTH, 
      title: 'Health', 
      desc: 'Improve lives and patient care',
      icon: Heart, 
      color: 'text-red-400',
      border: 'hover:border-red-500/50',
      bg: 'hover:bg-red-500/10',
      shadow: 'hover:shadow-red-500/20'
    },
    { 
      id: Domain.BUSINESS, 
      title: 'Business', 
      desc: 'Reinvent workflows and goals',
      icon: Briefcase, 
      color: 'text-indigo-400',
      border: 'hover:border-indigo-500/50',
      bg: 'hover:bg-indigo-500/10',
      shadow: 'hover:shadow-indigo-500/20'
    },
    { 
      id: Domain.TECHNOLOGY, 
      title: 'Technology', 
      desc: 'Push the boundaries of code',
      icon: Cpu, 
      color: 'text-cyan-400',
      border: 'hover:border-cyan-500/50',
      bg: 'hover:bg-cyan-500/10',
      shadow: 'hover:shadow-cyan-500/20'
    },
  ];

  return (
    <div className="h-full w-full max-w-7xl mx-auto flex flex-col justify-center animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-6">
        <div className="flex justify-center mb-6">
          <AppLogo size="xl" className="shadow-2xl shadow-indigo-500/20" />
        </div>
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>The AI-Powered Horizon</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            tHe<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">HoRiZon</span>
          </h1>
        </div>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Accelerating discovery, reimagining learning, and building a more accessible world.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => onNavigate(feature.id)}
            className={`group text-left p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl ${feature.border} ${feature.bg} ${feature.shadow}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-slate-900/50 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-slate-500 font-medium">
          Powered by Google Gemini 2.5 Flash & 3 Pro Preview
        </p>
      </div>
    </div>
  );
};