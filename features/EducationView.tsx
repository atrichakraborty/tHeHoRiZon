import React, { useState } from 'react';
import { BookOpen, GraduationCap, Sparkles, Brain, Target, Zap, HelpCircle, Loader2, ArrowRight } from 'lucide-react';
import { generateEduResponse } from '../services/gemini';
import { MarkdownView } from '../components/MarkdownView';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { UndoRedoToolbar } from '../components/UndoRedoToolbar';

const LEVELS = [
  { id: '5 year old', label: '5 Year Old', icon: '🎈', desc: 'Simple & Fun' },
  { id: 'High School', label: 'High School', icon: '🎒', desc: 'Foundational' },
  { id: 'Undergrad', label: 'Undergrad', icon: '🎓', desc: 'Detailed' },
  { id: 'PhD', label: 'PhD Researcher', icon: '🔬', desc: 'Expert' }
];

const STYLES = [
  { id: 'Standard', label: 'Standard', icon: BookOpen },
  { id: 'Socratic', label: 'Socratic', icon: HelpCircle },
  { id: 'Storytelling', label: 'Storytelling', icon: Sparkles },
  { id: 'Academic', label: 'Academic', icon: GraduationCap },
];

export const EducationView = () => {
  const { state: topic, setState: setTopic, undo, redo, canUndo, canRedo } = useUndoRedo('');
  const [level, setLevel] = useState(LEVELS[1].id);
  const [style, setStyle] = useState(STYLES[0].id);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'explain' | 'quiz' | 'analogy' | 'application'>('explain');

  const handleExplain = async (mode: 'explain' | 'quiz' | 'analogy' | 'application' = 'explain') => {
    if (!topic.trim()) return;
    setLoading(true);
    setActiveMode(mode);
    try {
      const text = await generateEduResponse(topic, level, style, mode);
      setExplanation(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto w-full">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-amber-400 mb-2 flex items-center gap-2">
          <GraduationCap className="w-8 h-8" />
          Education Reimagined
        </h2>
        <p className="text-slate-400">Personalized tutoring with adaptive learning styles and real-world context.</p>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-6 flex-1 overflow-hidden h-full">
        {/* Controls Column */}
        <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
          
          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject & Topic</label>
                <UndoRedoToolbar onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Quantum Entanglement"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Complexity Level</label>
              <div className="grid grid-cols-2 gap-2">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setLevel(lvl.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center gap-1 ${
                      level === lvl.id
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-xl">{lvl.icon}</span>
                    <span className="text-xs font-medium">{lvl.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Teaching Style</label>
               <div className="space-y-1.5">
                 {STYLES.map((s) => (
                   <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      style === s.id
                        ? 'bg-slate-700/80 border-amber-500/50 text-white'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                   >
                     <s.icon className={`w-4 h-4 ${style === s.id ? 'text-amber-400' : 'text-slate-500'}`} />
                     <span className="text-sm">{s.label}</span>
                     {style === s.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400"></div>}
                   </button>
                 ))}
               </div>
            </div>

            <button
              onClick={() => handleExplain('explain')}
              disabled={loading || !topic}
              className={`relative w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-3.5 rounded-xl transition-all overflow-hidden group shadow-lg shadow-amber-900/20 ${
                loading ? 'cursor-wait' : 'disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
               {loading && activeMode === 'explain' && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{ animation: 'shimmer 1.5s infinite' }}
                />
              )}
              <div className="flex items-center justify-center gap-2 relative z-10">
                {loading && activeMode === 'explain' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Teaching...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" /> Start Learning
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Output Column */}
        <div className="flex flex-col h-full overflow-hidden bg-slate-800/30 border border-slate-700/50 rounded-2xl relative">
          {!explanation && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 p-8 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
                <BookOpen className="w-16 h-16 relative z-10" />
              </div>
              <h3 className="text-lg font-medium text-slate-300 mb-2">Ready to Learn?</h3>
              <p className="max-w-xs mx-auto">Select a topic, difficulty, and teaching style to generate a personalized lesson.</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
             {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-20 backdrop-blur-sm">
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center gap-3 shadow-2xl">
                    <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                    <span className="text-sm font-medium text-slate-200">
                      {activeMode === 'quiz' ? 'Generating Quiz...' : activeMode === 'analogy' ? 'Creating Analogy...' : 'Writing Lesson...'}
                    </span>
                  </div>
                </div>
              )}

             {explanation && (
                <div className="animate-fade-in pb-20">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      {activeMode === 'quiz' ? <Target className="w-5 h-5 text-amber-400" /> : 
                       activeMode === 'analogy' ? <Zap className="w-5 h-5 text-amber-400" /> : 
                       <BookOpen className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight capitalize">{activeMode === 'explain' ? 'Lesson' : activeMode}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        {topic} • {LEVELS.find(l => l.id === level)?.label} • {style}
                      </p>
                    </div>
                  </div>
                  
                  <MarkdownView content={explanation} />
                </div>
              )}
          </div>

          {/* Adaptive Actions Toolbar */}
          {explanation && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/95 border-t border-slate-700/50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 whitespace-nowrap">Dive Deeper:</span>
                
                <button 
                  onClick={() => handleExplain('quiz')}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300 transition-all text-sm whitespace-nowrap"
                >
                  <Target className="w-3.5 h-3.5" /> Quiz Me
                </button>
                
                <button 
                  onClick={() => handleExplain('analogy')}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300 transition-all text-sm whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5" /> Give Analogy
                </button>
                
                <button 
                  onClick={() => handleExplain('application')}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all text-sm whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Real World Use
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};