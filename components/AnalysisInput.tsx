import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Image as ImageIcon } from 'lucide-react';

interface AnalysisInputProps {
  onAnalyze: (text: string, file?: File) => void;
  isLoading: boolean;
}

const AnalysisInput: React.FC<AnalysisInputProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!text && !file) return;
    onAnalyze(text, file || undefined);
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
      {/* Tabs */}
      <div className="flex space-x-2 mb-6 p-1 bg-slate-900/50 rounded-xl">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'text'
              ? 'bg-slate-700 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Text Input
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'image'
              ? 'bg-slate-700 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Screenshot
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[200px]">
        {activeTab === 'text' ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your transactions here... 
e.g., 
Swiggy Rs 450
Uber Rs 230
Starbucks Rs 350"
            className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-freo-500 focus:border-transparent outline-none transition-all resize-none placeholder-slate-600"
          />
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group ${
              file
                ? 'border-freo-500 bg-freo-500/10'
                : 'border-slate-600 hover:border-freo-400 hover:bg-slate-900'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="text-center relative w-full h-full flex flex-col items-center justify-center p-4">
                <div className="bg-slate-900 rounded-lg px-3 py-1 mb-2 text-xs text-freo-300 border border-freo-500/30">
                    Ready to upload
                </div>
                <p className="text-white font-medium truncate max-w-[80%]">{file.name}</p>
                <p className="text-sm text-freo-400 mt-1">Click to change</p>
                <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="absolute top-2 right-2 p-1 bg-slate-800 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 bg-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Upload className="w-6 h-6 text-freo-400" />
                </div>
                <p className="text-slate-300 font-medium">Click to upload statement</p>
                <p className="text-slate-500 text-sm mt-2">Support JPG, PNG</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || (!text && !file)}
        className={`w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
            isLoading || (!text && !file)
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-freo-600 to-freo-500 hover:from-freo-500 hover:to-freo-400 text-white shadow-lg shadow-freo-500/25 hover:shadow-freo-500/40 transform hover:-translate-y-0.5'
        }`}
      >
        {isLoading ? (
            <>
             <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
             Consulting the Spirits...
            </>
        ) : (
            <>
            Analyze My Vibe 🚀
            </>
        )}
      </button>
    </div>
  );
};

export default AnalysisInput;
