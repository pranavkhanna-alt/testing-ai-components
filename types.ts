export interface SpendItem {
  category: string;
  amount: number;
  currency: string;
}

export enum ToastType {
  ROAST = 'ROAST',
  TOAST = 'TOAST',
}

export interface SwapSuggestion {
  habitToBreak: string;
  betterAlternative: string;
  projectedImpact: string;
}

export interface AnalysisResult {
  spendSummary: SpendItem[];
  vibeScore: number;
  genZVibeLabel: string; // e.g., "Down Bad", "Main Character", "NPC"
  roastOrToastType: ToastType;
  roastOrToastMessage: string;
  recommendedProduct: string; // e.g. "Freo Pay", "Freo Gold Loan"
  freoTip: string;
  personaTitle: string;
  summaryText: string;
  swapSuggestions: SwapSuggestion[];
}

export interface AnalysisState {
  isLoading: boolean;
  result: AnalysisResult | null;
  error: string | null;
}

export interface QuestionnaireData {
  monthlyIncome: string;
  rentAndEmi: string; // Survival (Home loans, Rent)
  groceries: string; // Survival (Essentials)
  foodAndDining: string; // Leisure (Ordering in)
  vices: string; // Specific bad habits (Cigs, Alcohol)
  shoppingAndEntertainment: string; // Flex (Trips, Clothes)
  investments: string; // Future You (SIPs, Gold)
  hasInsurance: string; // 'yes' or 'no'
}