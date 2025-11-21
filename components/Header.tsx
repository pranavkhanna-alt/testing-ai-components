import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-10 text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-freo-900/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="flex flex-col items-center justify-center mb-6">
        {/* Freo Brand Label: Lowercase, Heavy Weight, Tight Tracking */}
        <h1 className="text-7xl font-black tracking-tighter text-white mb-1 leading-none select-none">
          freo
        </h1>
        <div className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-freo-400 to-accent-teal uppercase">
            Fin-Vibe
        </div>
      </div>
      
      <p className="text-zinc-400 text-lg max-w-md mx-auto">
        Let AI judge your spending habits. <br/>
        <span className="text-freo-400 font-medium flex items-center justify-center gap-1 mt-2">
           Strictly for the brave <Sparkles className="w-4 h-4" />
        </span>
      </p>
    </header>
  );
};

export default Header;