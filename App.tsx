import React, { useState } from 'react';
import Header from './components/Header';
import Questionnaire from './components/Questionnaire';
import ResultsView from './components/ResultsView';
import { analyzeFinancialData } from './services/geminiService';
import { AnalysisResult, QuestionnaireData } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (data: QuestionnaireData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeFinancialData(data);
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError("Oops! The financial spirits are confused. Please try again or check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-freo-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-freo-900/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-purple/10 blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <Header />

        {!result ? (
          <div className="animate-slide-up">
            <Questionnaire onAnalyze={handleAnalyze} isLoading={isLoading} />
            
            {error && (
              <div className="max-w-xl mx-auto mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200">
                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
                 <p>{error}</p>
              </div>
            )}

            {/* Info Section */}
            <div className="max-w-2xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center opacity-60">
               <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                   <div className="text-2xl mb-2">💬</div>
                   <h3 className="font-bold text-slate-200 mb-1">Answer</h3>
                   <p className="text-sm text-slate-400">Tell us where the money goes.</p>
               </div>
               <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                   <div className="text-2xl mb-2">🤖</div>
                   <h3 className="font-bold text-slate-200 mb-1">AI Analyze</h3>
                   <p className="text-sm text-slate-400">Gemini judges your choices.</p>
               </div>
               <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                   <div className="text-2xl mb-2">🚀</div>
                   <h3 className="font-bold text-slate-200 mb-1">Glow Up</h3>
                   <p className="text-sm text-slate-400">Get roasted into better habits.</p>
               </div>
            </div>
          </div>
        ) : (
          <div className="animate-slide-up">
             <ResultsView data={result} />
             
             <div className="text-center mt-12">
                 <button 
                    onClick={handleReset}
                    className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all font-medium"
                 >
                    Check Another Vibe
                 </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;