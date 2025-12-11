import React, { useState, useEffect } from 'react';
import { Briefcase, Send, Copy, Check } from 'lucide-react';
import { generateBusinessEmail } from '../services/gemini';
import { LoadingDots } from '../components/LoadingDots';
import { MarkdownView } from '../components/MarkdownView';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { UndoRedoToolbar } from '../components/UndoRedoToolbar';

const STORAGE_KEY = 'business_draft_points';

export const BusinessView = () => {
  // Initialize with saved data from localStorage if available
  const { state: points, setState: setPoints, undo, redo, canUndo, canRedo } = useUndoRedo(
    localStorage.getItem(STORAGE_KEY) || ''
  );
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-save to localStorage whenever points change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, points);
  }, [points]);

  const handleGenerate = async () => {
    if (!points.trim()) return;
    setLoading(true);
    setCopied(false);
    try {
      const text = await generateBusinessEmail(points);
      setEmail(text);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-indigo-400 mb-2 flex items-center gap-2">
          <Briefcase className="w-8 h-8" />
          Business
        </h2>
        <p className="text-slate-400">Reinvent workflows with intelligent automation and drafting.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 flex-1 overflow-hidden">
        <div className="flex flex-col">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-300">Key Points / Context</label>
              <UndoRedoToolbar onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
            </div>
            <textarea
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="- Reschedule project review to next Tuesday&#10;- Apologize for delay&#10;- Attach updated timeline"
              className="w-full flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none mb-4"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !points}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Draft Email
            </button>
          </div>
        </div>

        <div className="bg-slate-100 rounded-2xl p-6 text-slate-900 overflow-y-auto relative shadow-xl">
           {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-200/80 z-10 backdrop-blur-sm rounded-2xl">
              <LoadingDots />
            </div>
          )}

          {!email && !loading && (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
               <Briefcase className="w-16 h-16 mb-4" />
               <p>Generated draft will appear here</p>
             </div>
          )}

          {email && (
            <div className="animate-fade-in relative h-full flex flex-col">
              <div className="absolute top-0 right-0">
                <button 
                  onClick={copyToClipboard}
                  className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <div className="prose prose-slate max-w-none flex-1">
                 <MarkdownView content={email} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};