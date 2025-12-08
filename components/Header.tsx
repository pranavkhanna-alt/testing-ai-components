import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-10 text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-freo-900/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="flex flex-col items-center justify-center mb-6">
        {/* Freo Brand Label: Lowercase, heavy weight, distinct branding */}
        <h1 className="text-8xl font-black tracking-tighter text-white mb-2 leading-none select-none">
          freo
        </h1>
        <div className="text-xl font-bold tracking-[0.2em] text-freo-400 uppercase">
            Financial Vibe Check
        </div>
      </div>
      
      <p className="text-zinc-200 text-lg max-w-md mx-auto font-light">
        Let AI analyze your spending habits and give you a reality check. <br/>
        <span className="text-freo-400 font-medium flex items-center justify-center gap-1 mt-2">
           Simple. Smart. Witty. <Sparkles className="w-4 h-4" />
        </span>
      </p>
    </header>
  );
};

export default Header;
