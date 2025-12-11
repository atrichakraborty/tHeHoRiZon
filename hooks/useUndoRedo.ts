import { useState, useRef, useCallback } from 'react';

export const useUndoRedo = (initialState: string = '', delay: number = 700) => {
  const [state, setInternalState] = useState(initialState);
  const [past, setPast] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);
  
  const timeoutRef = useRef<number | null>(null);
  const lastCommitted = useRef(initialState);

  const setState = useCallback((newState: string) => {
    setInternalState(newState);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setPast(prev => [...prev, lastCommitted.current]);
      setFuture([]);
      lastCommitted.current = newState;
    }, delay);
  }, [delay]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    
    setFuture(prev => [state, ...prev]);
    setInternalState(previous);
    setPast(newPast);
    lastCommitted.current = previous;
  }, [past, state]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast(prev => [...prev, state]);
    setInternalState(next);
    setFuture(newFuture);
    lastCommitted.current = next;
  }, [future, state]);

  return { state, setState, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
};