import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ToastType } from '../types';
import { Flame, PartyPopper, Lightbulb, ArrowRight, Dumbbell, TrendingUp, CreditCard, ShieldCheck, Coins, Wallet } from 'lucide-react';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'];

const ResultsView = ({ data }: { data: any }) => {
  
  const isRoast = data.roastOrToastType === ToastType.ROAST;
  
  // Sanitize label to remove '!' as requested
  const cleanVerdictLabel = data.genZVibeLabel.replace(/[!]/g, '').trim();

  // Aggregate data by category and calculate total
  const { chartData, totalSpend } = useMemo(() => {
    const aggregated: Record<string, number> = {};
    let total = 0;

    if (Array.isArray(data.spendSummary)) {
        data.spendSummary.forEach((item: any) => {
            const cat = item.category;
            const amount = Number(item.amount);
            aggregated[cat] = (aggregated[cat] || 0) + amount;
            total += amount;
        });
    }

    const chartData = Object.entries(aggregated)
        .map(([name, value], index) => ({
            name,
            value,
            color: COLORS[index % COLORS.length]
        }))
        .sort((a, b) => b.value - a.value);

    return { chartData, totalSpend: total };
  }, [data.spendSummary]);

  const getProductIcon = (productName: string) => {
      const lower = productName.toLowerCase();
      if (lower.includes('pay')) return <CreditCard className="w-6 h-6" />;
      if (lower.includes('insurance')) return <ShieldCheck className="w-6 h-6" />;
      if (lower.includes('gold')) return <Coins className="w-6 h-6" />;
      return <Wallet className="w-6 h-6" />; // Loan default
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Persona Header */}
      <div className="text-center space-y-2">
        <span className="inline-block px-4 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium uppercase tracking-wider">
            Your Financial Persona
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-white">
          {data.personaTitle}
        </h2>
        <p className="text-xl text-zinc-300 max-w-2xl mx-auto font-light italic">
          "{data.summaryText}"
        </p>
      </div>

      {/* Score & Spend Grid */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Vibe Score Card */}
        <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:border-freo-500/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-freo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
                {/* Circular Progress BG */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="96" cy="96" r="88"
                        className="text-zinc-800 stroke-current"
                        strokeWidth="12"
                        fill="transparent"
                    />
                    <circle
                        cx="96" cy="96" r="88"
                        className={`stroke-current transition-all duration-1000 ease-out ${
                            data.vibeScore > 70 ? 'text-green-500' : data.vibeScore > 40 ? 'text-yellow-500' : 'text-red-500'
                        }`}
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={553} // 2 * PI * 88
                        strokeDashoffset={553 - (553 * data.vibeScore) / 100}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-white">{data.vibeScore}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Financial Score</span>
                </div>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 w-full">
                 <div className="space-y-1 w-full">
                    <span className="text-zinc-400 text-sm uppercase tracking-wide">Financial Style</span>
                    <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-freo-300 to-white">
                        {cleanVerdictLabel}
                    </div>
                 </div>
            </div>
        </div>

        {/* Spend Chart & Breakdown */}
        <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 flex flex-col hover:border-freo-500/30 transition-colors">
             <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <span className="bg-freo-500/20 p-1.5 rounded text-freo-400">📊</span> 
                Spend Breakdown
             </h3>
             
             <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Pie Chart */}
                <div className="w-full md:w-1/2 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                                itemStyle={{ color: '#f4f4f5', fontWeight: 600 }}
                                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Spent']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Detailed Breakdown List */}
                <div className="w-full md:w-1/2 space-y-5">
                    <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
                        <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Total Monthly Spend</span>
                        <span className="text-3xl font-bold text-white tracking-tight">₹{totalSpend.toLocaleString()}</span>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {chartData.map((item) => (
                            <div key={item.name} className="group">
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-zinc-200 font-medium flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full shadow-[0_0_8px]" style={{backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}40`}}></span>
                                        {item.name}
                                    </span>
                                    <span className="text-zinc-300 font-mono">₹{item.value.toLocaleString()}</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-zinc-800">
                                    <div 
                                        className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-125"
                                        style={{ width: `${(item.value / (totalSpend || 1)) * 100}%`, backgroundColor: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* Improvement Plan */}
      {data.swapSuggestions && data.swapSuggestions.length > 0 && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl shadow-black/50">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <TrendingUp className="w-64 h-64 text-freo-400" />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10 border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-accent-teal/10 text-accent-teal border border-accent-teal/20">
                        <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-white">Smart Swaps</h3>
                        <p className="text-zinc-300 text-sm">Actionable steps to improve your financial health.</p>
                    </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 gap-4 relative z-10">
                  {data.swapSuggestions.map((swap: any, idx: number) => (
                      <div key={idx} className="bg-black rounded-xl p-5 flex flex-col md:flex-row items-center gap-6 border border-zinc-800 hover:border-accent-teal/50 transition-all group">
                          
                          {/* Habit to Break */}
                          <div className="flex-1 text-center md:text-left w-full md:w-auto bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">INSTEAD OF</div>
                              <div className="text-zinc-300 font-medium text-lg group-hover:text-white transition-colors">{swap.habitToBreak}</div>
                          </div>
                          
                          {/* Arrow */}
                          <div className="flex items-center justify-center">
                             <div className="bg-zinc-900 p-2 rounded-full border border-zinc-800">
                                <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-accent-teal transition-colors" />
                             </div>
                          </div>

                          {/* Better Alternative */}
                          <div className="flex-1 text-center md:text-left w-full md:w-auto bg-freo-900/10 p-3 rounded-lg border border-freo-500/20">
                              <div className="text-[10px] text-freo-400 font-bold uppercase tracking-widest mb-1">TRY THIS</div>
                              <div className="text-white font-bold text-lg">{swap.betterAlternative}</div>
                          </div>

                          {/* Impact */}
                          <div className="md:border-l border-zinc-800 md:pl-6 flex-1 text-center md:text-right w-full md:w-auto">
                              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">BENEFIT</div>
                              <div className="text-accent-teal font-medium italic text-lg">"{swap.projectedImpact}"</div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Verdict & Tip Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Verdict Card */}
          <div className={`rounded-2xl p-6 border relative overflow-hidden ${
              isRoast 
              ? 'bg-red-950/10 border-red-500/20' 
              : 'bg-green-950/10 border-green-500/20'
          }`}>
              <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${isRoast ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                      {isRoast ? <Flame className="w-6 h-6" /> : <PartyPopper className="w-6 h-6" />}
                  </div>
                  <h3 className={`font-bold text-xl ${isRoast ? 'text-red-100' : 'text-green-100'}`}>
                      {isRoast ? 'The Reality Check' : 'The Kudos'}
                  </h3>
              </div>
              <p className="text-zinc-200 text-lg leading-relaxed italic opacity-90">
                  "{data.roastOrToastMessage}"
              </p>
          </div>

          {/* Freo Tip Card */}
          <div className="rounded-2xl p-6 border border-freo-500/30 bg-freo-900/10 relative overflow-hidden flex flex-col">
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-freo-500/10 rounded-full blur-2xl" />
               
               <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-2 rounded-lg bg-freo-500/20 text-freo-400">
                      <Lightbulb className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xl text-freo-100">
                      Freo Recommendation
                  </h3>
              </div>
              
              <div className="flex-grow relative z-10">
                   {data.recommendedProduct && (
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-freo-500/10 border border-freo-500/40 text-freo-300 text-sm font-bold mb-3">
                            {getProductIcon(data.recommendedProduct)}
                            {data.recommendedProduct}
                       </div>
                   )}
                   <p className="text-zinc-200 text-lg leading-relaxed">
                      {data.freoTip}
                   </p>
              </div>
          </div>
      </div>

    </div>
  );
};

export default ResultsView;