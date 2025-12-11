import React, { useState, useRef } from 'react';
import { Eye, Volume2, Upload, Play, Loader2, X, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { describeImage, generateSpeech } from '../services/gemini';
import { LoadingDots } from '../components/LoadingDots';
import { MarkdownView } from '../components/MarkdownView';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { UndoRedoToolbar } from '../components/UndoRedoToolbar';

export const AccessibilityView = () => {
  const [activeTab, setActiveTab] = useState<'vision' | 'tts'>('vision');
  
  // Vision State
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionError, setVisionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TTS State
  const { state: textToSpeak, setState: setTextToSpeak, undo, redo, canUndo, canRedo } = useUndoRedo('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);

  // Vision Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setDescription('');
        setVisionError(null);
        // We wait for user to click analyze
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setImage(null);
    setDescription('');
    setVisionError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setVisionLoading(true);
    setVisionError(null);
    try {
      // Extract base64 and mime from Data URL
      const base64 = image.split(',')[1];
      const mime = image.split(';')[0].split(':')[1];
      const text = await describeImage(base64, mime);
      
      if (!text) {
        setVisionError("Unable to analyze image. Please try a different image or try again later.");
        return;
      }
      
      setDescription(text);
    } catch (err) {
      setVisionError("An unexpected error occurred during analysis.");
    } finally {
      setVisionLoading(false);
    }
  };

  // TTS Handlers
  const handleTTS = async () => {
    if (!textToSpeak.trim()) return;
    setTtsLoading(true);
    setAudioUrl(null);
    try {
      const base64Audio = await generateSpeech(textToSpeak);
      if (base64Audio) {
        // Decode base64 to blob for playback
        const binaryString = window.atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/wav' }); // Assuming WAV/PCM default
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      }
    } finally {
      setTtsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-rose-400 mb-2 flex items-center gap-2">
          <Eye className="w-8 h-8" />
          Accessibility
        </h2>
        <p className="text-slate-400">Build tools that work for everyone using Vision and Speech.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('vision')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'vision' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Eye className="w-5 h-5" /> Vision Assistant
        </button>
        <button
          onClick={() => setActiveTab('tts')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'tts' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Volume2 className="w-5 h-5" /> Text to Speech
        </button>
      </div>

      <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 overflow-y-auto">
        {activeTab === 'vision' && (
          <div className="space-y-6">
            <div 
              onClick={() => !image && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all group min-h-[300px] overflow-hidden ${
                image 
                  ? 'border-slate-700 bg-slate-900/50 cursor-default' 
                  : 'border-slate-600 hover:border-rose-400 hover:bg-slate-800/50 cursor-pointer'
              }`}
            >
              {image ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                  <img src={image} alt="Upload preview" className="max-h-[400px] w-auto object-contain rounded-lg shadow-2xl" />
                  
                  <button 
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-red-500/80 text-white rounded-full transition-colors backdrop-blur-sm border border-slate-700"
                    title="Remove Image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center p-8 text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-rose-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-200 mb-2">Upload an Image</h3>
                  <p className="text-slate-400 max-w-sm text-sm">
                    Drag and drop or click to select an image for AI analysis.
                    <br/><span className="text-slate-500 text-xs mt-2 block">Supports JPG, PNG, WebP</span>
                  </p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
              />
            </div>

            {/* Error Message */}
            {visionError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{visionError}</p>
              </div>
            )}

            {/* Action Button */}
            {image && !visionLoading && !description && (
              <div className="flex justify-center animate-fade-in">
                <button
                  onClick={handleAnalyze}
                  className="bg-rose-600 hover:bg-rose-500 text-white px-8 py-3 rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-rose-500/20"
                >
                  <Sparkles className="w-5 h-5" />
                  Analyze Image
                </button>
              </div>
            )}

            {visionLoading && <LoadingDots />}
            
            {description && (
              <div className="bg-slate-900/50 p-6 rounded-xl border border-rose-500/20 animate-fade-in">
                 <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Analysis Result
                  </h3>
                   <button onClick={handleAnalyze} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
                     <Sparkles className="w-3 h-3" /> Regenerate
                   </button>
                </div>
                <MarkdownView content={description} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'tts' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">Text to Speak</label>
                <UndoRedoToolbar onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
              </div>
              <textarea
                value={textToSpeak}
                onChange={(e) => setTextToSpeak(e.target.value)}
                placeholder="Enter text here to generate lifelike speech..."
                className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-none"
              />
            </div>

            <button
              onClick={handleTTS}
              disabled={ttsLoading || !textToSpeak}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {ttsLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Play className="w-5 h-5" />}
              Generate Speech
            </button>

            {audioUrl && (
              <div className="bg-slate-900/80 p-6 rounded-xl border border-rose-500/20 flex flex-col items-center animate-fade-in">
                <audio controls src={audioUrl} className="w-full" autoPlay />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};