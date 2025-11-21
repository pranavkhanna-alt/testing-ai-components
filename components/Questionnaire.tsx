import React, { useState } from 'react';
import { ArrowRight, IndianRupee, ChevronLeft, ThumbsUp, ThumbsDown } from 'lucide-react';
import { QuestionnaireData } from '../types';

interface QuestionnaireProps {
  onAnalyze: (data: QuestionnaireData) => void;
  isLoading: boolean;
}

const STEPS = [
  {
    id: 'monthlyIncome',
    question: "First off, what's the monthly loot?",
    subtext: "Salary, side hustles, that money grandma gave you - total it up.",
    icon: "💸",
    placeholder: "e.g. 80000",
    type: 'number'
  },
  {
    id: 'rentAndEmi',
    question: "Adulting 101: Rent or Home Loans?",
    subtext: "Keeping a roof over your head. Any EMIs haunting you?",
    icon: "🏠",
    placeholder: "e.g. 25000",
    type: 'number'
  },
  {
    id: 'groceries',
    question: "Fuel for the machine: Groceries & Bills?",
    subtext: "The boring stuff you actually need to survive (Toothpaste, WiFi, Power).",
    icon: "🥦",
    placeholder: "e.g. 6000",
    type: 'number'
  },
  {
    id: 'vices',
    question: "Real talk... Cigs, Vapes, or Drinks?",
    subtext: "How many packs a day? Weekend benders? (We won't judge... much).",
    icon: "🚬",
    placeholder: "e.g. 4000",
    type: 'number'
  },
  {
    id: 'foodAndDining',
    question: "Kitchen vs. The App: Ordering in?",
    subtext: "Swiggy, Zomato, Starbucks runs because 'cooking is hard'.",
    icon: "🍔",
    placeholder: "e.g. 9000",
    type: 'number'
  },
  {
    id: 'shoppingAndEntertainment',
    question: "Retail Therapy & The Flex?",
    subtext: "New kicks, gadgets, movies, or 'accidental' Amazon purchases.",
    icon: "🛍️",
    placeholder: "e.g. 7000",
    type: 'number'
  },
  {
    id: 'investments',
    question: "Smart Moves: Are we investing?",
    subtext: "SIPs, Stocks, Gold? Paying 'Future You' or just vibing?",
    icon: "🚀",
    placeholder: "e.g. 10000",
    type: 'number'
  },
  {
    id: 'hasInsurance',
    question: "Last one: Got Insurance?",
    subtext: "Health or Life. Are you covered if things go south?",
    icon: "🛡️",
    placeholder: "",
    type: 'options',
    options: [
      { value: 'yes', label: 'Yes, I\'m covered', icon: ThumbsUp },
      { value: 'no', label: 'Nah, living on the edge', icon: ThumbsDown }
    ]
  }
];

const Questionnaire: React.FC<QuestionnaireProps> = ({ onAnalyze, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      onAnalyze(answers as QuestionnaireData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleChange = (value: string) => {
    setAnswers({ ...answers, [STEPS[currentStep].id]: value });
  };

  const handleOptionSelect = (value: string) => {
      setAnswers({ ...answers, [STEPS[currentStep].id]: value });
      // Add a small delay for better UX
      setTimeout(() => {
          if (currentStep < STEPS.length - 1) {
              setCurrentStep(curr => curr + 1);
          } else {
              onAnalyze({ ...answers, [STEPS[currentStep].id]: value } as QuestionnaireData);
          }
      }, 200);
  };

  const currentQuestion = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-zinc-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-freo-500 to-accent-teal transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 shadow-xl relative overflow-hidden min-h-[450px] flex flex-col">
        {/* Background Decor */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-freo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex-grow flex flex-col justify-center animate-slide-up key={currentStep}">
            <div className="text-4xl mb-6">{currentQuestion.icon}</div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
              {currentQuestion.question}
            </h2>
            
            <p className="text-zinc-400 text-lg mb-8">
              {currentQuestion.subtext}
            </p>

            {currentQuestion.type === 'number' ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="number"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    onKeyDown={(e) => e.key === 'Enter' && answers[currentQuestion.id] && handleNext()}
                    className="w-full bg-black border border-zinc-800 text-white text-xl rounded-xl pl-10 pr-4 py-4 focus:ring-2 focus:ring-freo-500 focus:border-transparent outline-none placeholder-zinc-600 transition-all"
                    autoFocus
                  />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options?.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => handleOptionSelect(opt.value)}
                            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${
                                answers[currentQuestion.id] === opt.value 
                                ? 'bg-freo-500/20 border-freo-500 text-white' 
                                : 'bg-black border-zinc-800 text-zinc-400 hover:border-freo-400/50 hover:bg-zinc-900/50 hover:text-white'
                            }`}
                        >
                            <opt.icon className={`w-8 h-8 mb-2 ${answers[currentQuestion.id] === opt.value ? 'text-freo-400' : ''}`} />
                            <span className="font-bold">{opt.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800/50">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 0 ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {currentQuestion.type === 'number' && (
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id] || isLoading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    !answers[currentQuestion.id] || isLoading
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-freo-500 hover:bg-freo-600 text-white shadow-lg shadow-freo-500/25 hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  ) : (
                    <>
                      {currentStep === STEPS.length - 1 ? 'Reveal My Vibe' : 'Next'}
                      {currentStep !== STEPS.length - 1 && <ArrowRight className="w-5 h-5" />}
                    </>
                  )}
                </button>
            )}
            {/* Hide Next button for options as selection auto-advances, but show loader if it's the last step and loading */}
            {currentQuestion.type === 'options' && isLoading && (
                 <div className="flex items-center gap-2 text-freo-400 font-bold animate-pulse">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-freo-400"></span>
                    Calculating...
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;