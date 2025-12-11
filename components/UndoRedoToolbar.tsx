import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

interface Props {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  className?: string;
}

export const UndoRedoToolbar: React.FC<Props> = ({ onUndo, onRedo, canUndo, canRedo, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="w-4 h-4" />
      </button>
    </div>
  );
};