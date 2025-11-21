import React from 'react';
import { Wallet, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-8 text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-freo-500/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="bg-gradient-to-br from-freo-400 to-accent-purple p-3 rounded-xl shadow-lg shadow-freo-500/20">
            <Wallet className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white">
          Freo <span className="text-transparent bg-clip-text bg-gradient-to-r from-freo-400 to-accent-teal">Fin-Vibe</span>
        </h1>
      </div>
      
      <p className="text-slate-400 text-lg max-w-md mx-auto mt-4">
        Let AI judge your spending habits. <br/>
        <span className="text-freo-300 font-medium flex items-center justify-center gap-1">
           Strictly for the brave <Sparkles className="w-4 h-4" />
        </span>
      </p>
    </header>
  );
};

export default Header;
