import React, { useState } from 'react';
import { FileCode, FileText, ArrowRight, CheckCircle2, Loader2, Circle, Cpu, Sparkles, Sun, Moon } from 'lucide-react';
import { generateDocumentation } from '../services/gemini';
import { MarkdownView } from '../components/MarkdownView';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { UndoRedoToolbar } from '../components/UndoRedoToolbar';

const GENERATION_STEPS = [
  "Analyzing code structure",
  "Extracting function signatures",
  "Identifying parameters & returns",
  "Generating usage examples",
  "Formatting Markdown output"
];

const MODELS = [
  { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
];

const SNIPPETS = [
  {
    id: 'react-component',
    label: 'React Component',
    code: `import React from 'react';

interface ButtonProps {
  /** The text to display inside the button */
  label: string;
  /** Callback function when clicked */
  onClick: () => void;
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Whether the button is disabled */
  disabled?: boolean;
}

/**
 * A reusable button component with multiple variants.
 */
export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={\`\${baseStyles} \${variants[variant]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
    >
      {label}
    </button>
  );
};`
  },
  {
    id: 'utility-function',
    label: 'Utility Function',
    code: `/**
 * Debounces a function call, ensuring it's only executed after a delay.
 * 
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// Usage Example:
// const handleResize = debounce(() => console.log('Resized'), 500);
// window.addEventListener('resize', handleResize);`
  },
  {
    id: 'api-service',
    label: 'API Service Class',
    code: `interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Service for handling user-related API operations.
 */
class UserService {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  /**
   * Fetches a user by their unique ID.
   * @param id The user's UUID
   * @throws Will throw an error if the user is not found
   */
  async getUser(id: string): Promise<User> {
    const response = await fetch(\`\${this.baseUrl}/users/\${id}\`, {
      headers: { Authorization: \`Bearer \${this.token}\` }
    });

    if (!response.ok) {
      throw new Error(\`User not found: \${response.statusText}\`);
    }

    return response.json();
  }

  /**
   * Updates user profile data.
   */
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await fetch(\`\${this.baseUrl}/users/\${id}\`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${this.token}\`
      },
      body: JSON.stringify(data)
    });

    return response.json();
  }
}`
  }
];

export const TechnologyView = () => {
  const { state: code, setState: setCode, undo, redo, canUndo, canRedo } = useUndoRedo('');
  const [docs, setDocs] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [modelNotification, setModelNotification] = useState('');
  const [editorTheme, setEditorTheme] = useState<'dark' | 'light'>('dark');

  const handleGenerate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setDocs('');
    setCurrentStep(0);

    // Simulate progress steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < GENERATION_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 800);

    try {
      const result = await generateDocumentation(code, selectedModel);
      setDocs(result);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setCurrentStep(0);
    }
  };

  const handleSnippetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const snippetId = e.target.value;
    if (!snippetId) return;
    
    const snippet = SNIPPETS.find(s => s.id === snippetId);
    if (snippet) {
      setCode(snippet.code);
    }
    // Reset select value to allow re-selection
    e.target.value = "";
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModelId = e.target.value;
    setSelectedModel(newModelId);
    const modelName = MODELS.find(m => m.id === newModelId)?.name;
    setModelNotification(`${modelName} Active`);
    setTimeout(() => setModelNotification(''), 3000);
  };

  const toggleTheme = () => setEditorTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto w-full">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
          <FileCode className="w-8 h-8" />
          Auto-Documentation
        </h2>
        <p className="text-slate-400">Instantly generate comprehensive Markdown documentation from source code.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1 overflow-hidden h-full">
        
        {/* Code Input */}
        <div className="flex flex-col h-full">
          <div className={`border-t border-x rounded-t-xl p-3 flex items-center justify-between transition-colors ${
            editorTheme === 'dark' 
              ? 'bg-slate-950 border-slate-800' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500">SOURCE CODE</span>
              <div className={`h-4 w-px ${editorTheme === 'dark' ? 'bg-slate-800' : 'bg-gray-300'}`}></div>
              
              <div className="flex items-center gap-2 relative">
                <Cpu className="w-3 h-3 text-cyan-500/70" />
                <select
                  value={selectedModel}
                  onChange={handleModelChange}
                  className={`bg-transparent text-xs font-medium focus:outline-none cursor-pointer transition-colors ${
                    editorTheme === 'dark' 
                      ? 'text-cyan-400 hover:text-cyan-300' 
                      : 'text-cyan-700 hover:text-cyan-600'
                  }`}
                >
                  {MODELS.map(m => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-slate-300">
                      {m.name}
                    </option>
                  ))}
                </select>
                {modelNotification && (
                  <div className="absolute top-full left-0 mt-2 z-50 animate-fade-in">
                    <div className="bg-slate-800 text-cyan-400 text-[10px] px-2 py-1 rounded border border-cyan-500/20 whitespace-nowrap shadow-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3" />
                      {modelNotification}
                    </div>
                  </div>
                )}
              </div>

              <div className={`h-4 w-px ${editorTheme === 'dark' ? 'bg-slate-800' : 'bg-gray-300'}`}></div>

              <div className="flex items-center gap-2 group">
                <Sparkles className="w-3 h-3 text-amber-400/70 group-hover:text-amber-400 transition-colors" />
                <select
                  onChange={handleSnippetSelect}
                  defaultValue=""
                  className={`bg-transparent text-xs font-medium focus:outline-none cursor-pointer transition-colors w-24 ${
                    editorTheme === 'dark'
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <option value="" disabled>Load Example...</option>
                  {SNIPPETS.map(s => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-slate-300">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className={`p-1.5 rounded-lg transition-colors ${
                  editorTheme === 'dark' 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                    : 'text-slate-400 hover:text-slate-700 hover:bg-gray-200'
                }`}
                title={`Switch to ${editorTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {editorTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              <UndoRedoToolbar onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} className="mr-2" />
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
              </div>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste your class, function, or component code here..."
            className={`flex-1 w-full border-x border-b rounded-b-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-mono text-sm leading-relaxed resize-none custom-scrollbar ${
              editorTheme === 'dark'
                ? 'bg-slate-950 border-slate-800 text-slate-300 placeholder-slate-600'
                : 'bg-white border-gray-200 text-slate-800 placeholder-slate-400 shadow-sm'
            }`}
            spellCheck="false"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !code}
            className={`relative mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-medium transition-all overflow-hidden group ${
              loading ? 'cursor-wait' : 'disabled:opacity-50'
            }`}
          >
            {loading && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ animation: 'shimmer 1.5s infinite' }}
              />
            )}
            <div className="flex items-center justify-center gap-2 relative z-10">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Docs <ArrowRight className="w-4 h-4" />
                </>
              )}
            </div>
          </button>
        </div>

        {/* Docs Output */}
        <div className="flex flex-col h-full relative">
           <div className="bg-slate-800 border border-slate-700 rounded-t-xl p-3 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <FileText className="w-3 h-3" /> MARKDOWN PREVIEW
            </span>
          </div>
          
          <div className="flex-1 bg-slate-800/50 border-x border-b border-slate-700 rounded-b-xl p-6 overflow-y-auto custom-scrollbar relative">
             {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 z-20 backdrop-blur-sm rounded-b-xl">
                 <div className="w-full max-w-xs space-y-5">
                    <h3 className="text-cyan-400 font-semibold text-center mb-2 tracking-wide text-sm uppercase">Processing Code</h3>
                    {GENERATION_STEPS.map((step, index) => {
                       const isCompleted = index < currentStep;
                       const isCurrent = index === currentStep;
                       
                       return (
                         <div key={index} className={`flex items-center gap-3 transition-all duration-300 ${isCurrent || isCompleted ? 'opacity-100' : 'opacity-30'}`}>
                           {isCompleted ? (
                             <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                           ) : isCurrent ? (
                             <Loader2 className="w-5 h-5 text-cyan-500 animate-spin shrink-0" />
                           ) : (
                             <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                           )}
                           <span className={`text-sm font-medium ${isCurrent ? 'text-cyan-100' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                             {step}
                           </span>
                         </div>
                       );
                    })}
                  </div>
              </div>
            )}
            
            {!docs && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                <FileText className="w-16 h-16 mb-4" />
                <p>Documentation will render here</p>
              </div>
            )}

            {docs && (
              <div className="animate-fade-in">
                <MarkdownView content={docs} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};