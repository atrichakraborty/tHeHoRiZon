import React, { useState } from 'react';
import { X, MessageSquare, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [type, setType] = useState<'issue' | 'suggestion'>('suggestion');
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setStatus('submitting');
    // Simulate API submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
    
    setTimeout(() => {
      onClose();
      // Reset state after close animation would finish
      setTimeout(() => {
        setStatus('idle');
        setText('');
        setType('suggestion');
      }, 300);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          Share Feedback
        </h2>
        <p className="text-slate-400 text-sm mb-6">Help us improve Gemini Horizons.</p>

        {status === 'success' ? (
          <div className="py-8 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-white font-medium mb-1">Thank you!</h3>
            <p className="text-slate-400 text-sm">Your feedback has been received.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('suggestion')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  type === 'suggestion'
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-200'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Suggestion
              </button>
              <button
                type="button"
                onClick={() => setType('issue')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  type === 'issue'
                    ? 'bg-red-500/20 border-red-500/50 text-red-200'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <AlertCircle className="w-4 h-4" /> Report Issue
              </button>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={type === 'suggestion' ? "What would you like to see improved?" : "Describe the issue you encountered..."}
              className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none text-sm"
              required
            />

            <button
              type="submit"
              disabled={status === 'submitting' || !text.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};