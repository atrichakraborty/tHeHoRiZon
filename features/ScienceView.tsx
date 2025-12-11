import React, { useState } from 'react';
import { Database, FileText, FlaskConical, Lightbulb, Tag, ArrowRight } from 'lucide-react';
import { organizeResearch } from '../services/gemini';
import { LoadingDots } from '../components/LoadingDots';
import { MarkdownView } from '../components/MarkdownView';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { UndoRedoToolbar } from '../components/UndoRedoToolbar';

interface ResearchEntry {
  title: string;
  summary: string;
  content: string;
  tags: string[];
  category: string;
}

const ENTRY_TYPES = [
  { id: 'literature', label: 'Literature Review', icon: FileText },
  { id: 'experiment', label: 'Experimental Data', icon: FlaskConical },
  { id: 'hypothesis', label: 'Hypothesis Tracking', icon: Lightbulb },
];

export const ScienceView = () => {
  const { state: notes, setState: setNotes, undo, redo, canUndo, canRedo } = useUndoRedo('');
  const [type, setType] = useState('literature');
  const [entry, setEntry] = useState<ResearchEntry | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOrganize = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    setEntry(null);
    
    try {
      const result = await organizeResearch(notes, type);
      setEntry(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
          <Database className="w-8 h-8" />
          Scientific Knowledge Base
        </h2>
        <p className="text-slate-400">Organize literature, track experiments, and hypothesize with AI assistance.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 flex-1 overflow-hidden">
        
        {/* Input Column */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col h-full">
            <label className="block text-sm font-medium text-slate-300 mb-3">Entry Type</label>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {ENTRY_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    type === t.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <t.icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-300">Raw Notes / Abstract / Data</label>
              <UndoRedoToolbar onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
            </div>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`Paste your raw notes here. For example: "Experiment 42b results: temp increased by 10%... observed reaction..."`}
              className="w-full flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none mb-4 font-mono text-sm"
            />
            
            <button
              onClick={handleOrganize}
              disabled={loading || !notes}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Database className="w-4 h-4" />
              Generate Entry
            </button>
          </div>
        </div>

        {/* Output Column */}
        <div className="flex flex-col h-full overflow-hidden">
           <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl flex-1 overflow-y-auto relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10 backdrop-blur-sm">
                <LoadingDots />
              </div>
            )}
            
            {!entry && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 p-8 text-center">
                <Database className="w-16 h-16 mb-4" />
                <p>Enter data to generate a structured knowledge base entry</p>
              </div>
            )}

            {entry && (
              <div className="p-8 animate-fade-in">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                    {entry.category}
                  </span>
                  {entry.tags.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-xs border border-slate-600">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">{entry.title}</h1>
                <p className="text-slate-400 italic mb-8 border-l-2 border-emerald-500 pl-4">{entry.summary}</p>

                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                   <MarkdownView content={entry.content} />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};