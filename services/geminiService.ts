import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ToastType, QuestionnaireData } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please define API_KEY in your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    spendSummary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Life component category. STRICTLY use one of: 'Survival Mode 🏠', 'Future You 🚀', 'Leisure 🏖️', 'The Flex 💸'." },
          amount: { type: Type.NUMBER },
          currency: { type: Type.STRING },
        },
        required: ["category", "amount", "currency"],
      },
    },
    vibeScore: { type: Type.INTEGER, description: "A score from 0 to 100 indicating financial health." },
    genZVibeLabel: { type: Type.STRING, description: "A 1-3 word slang term for their score. NO punctuation. NO exclamation marks." },
    roastOrToastType: { type: Type.STRING, enum: [ToastType.ROAST, ToastType.TOAST] },
    roastOrToastMessage: { type: Type.STRING, description: "A witty roast or congratulatory toast. Adhere to the specific tone guidelines." },
    recommendedProduct: { type: Type.STRING, description: "The specific Freo product recommendation." },
    freoTip: { type: Type.STRING, description: "A persuasive pitch explaining WHY this specific product helps them. Includes insurance advice if applicable." },
    personaTitle: { type: Type.STRING, description: "A cool title for the user's financial persona." },
    summaryText: { type: Type.STRING, description: "A short, witty Gen-Z style summary of the spending habits." },
    swapSuggestions: {
      type: Type.ARRAY,
      description: "Real-time life improvement swaps. Replace bad habits with self-improvement.",
      items: {
        type: Type.OBJECT,
        properties: {
            habitToBreak: { type: Type.STRING, description: "The bad spending habit." },
            betterAlternative: { type: Type.STRING, description: "The better life choice." },
            projectedImpact: { type: Type.STRING, description: "The result." }
        }
      }
    }
  },
  required: ["spendSummary", "vibeScore", "genZVibeLabel", "roastOrToastType", "roastOrToastMessage", "recommendedProduct", "freoTip", "personaTitle", "summaryText", "swapSuggestions"],
};

export const analyzeFinancialData = async (
  data: QuestionnaireData
): Promise<AnalysisResult> => {
  const ai = getClient();

  const prompt = `
    You are a Gen-Z financial assistant for 'Freo'. 
    Analyze the user's financial profile based on their answers.
    
    USER DATA:
    - Monthly Income: ₹${data.monthlyIncome}
    - Survival Mode (Rent/EMI/Loans): ₹${data.rentAndEmi}
    - Survival Mode (Groceries/Bills): ₹${data.groceries}
    - Food/Dining (Leisure): ₹${data.foodAndDining}
    - Vices (Cigs/Alcohol): ₹${data.vices}
    - The Flex (Shopping/Fun/Trips): ₹${data.shoppingAndEntertainment}
    - Future You (Investments/SIPs): ₹${data.investments}
    - Has Insurance: ${data.hasInsurance} (If 'no', this is a gap)
    
    GOALS:
    1. **Categorize**: Group the amounts into the 4 Life Components:
       - 'Survival Mode 🏠' = Rent/EMI + Groceries
       - 'Future You 🚀' = Investments
       - 'Leisure 🏖️' = Food/Dining + Vices + Shopping + Entertainment
       - 'The Flex 💸' = Any specifically high luxury spend, otherwise merge into Leisure.
    
    2. **Vibe Score & Label**: 
       - Calculate 0-100. 
       - High Score: >20% in 'Future You' AND Has Insurance = 'Yes'.
       - Deduct points heavily if Has Insurance = 'No'.
       - Label: Slang (e.g., "Down Bad", "Academic Weapon", "CEO Mindset"). Keep it simple, NO punctuation, NO "!" characters.

    3. **Tone & Roast/Toast Guidelines (CRITICAL)**: 
       - **Glow Up Logic**: 
         - IF (Food/Dining <= 3000 AND Vices <= 2000): Use "less rude verbiage". Be encouraging/constructive.
         - IF (Food/Dining > 3000 OR Vices > 2000): Be "more open", direct, and witty. Roast the specific high spend.
       
    4. **Freo Product Match**:
       - **Step 1: Select Base Product**:
         - **Freo Pay**: If high daily small spends (Food, Dining, Leisure).
         - **Freo Personal Loan**: If high debt, EMIs, or big 'Flex' spending.
         - **Freo Gold Loan**: If 'Survival Mode' expenses > 60% of income.
       
       - **Step 2: Insurance Check**:
         - IF 'Has Insurance' is 'no': 
           - Set \`recommendedProduct\` to "{Base Product} + Freo Insurance".
           - In \`freoTip\`: Pitch the base product, then explicitly ADD: "Also, be a pro and start insuring yourself with Freo Insurance."
         - IF 'Has Insurance' is 'yes':
           - Set \`recommendedProduct\` to just the {Base Product}.
           - \`freoTip\` focuses on the base product.

    5. **Swaps**:
       - If spends are low (<=3000/2000), suggest subtle optimizations.
       - If spends are high, suggest hard stops (Gym instead of Bar).

    Tone: Gen Z slang but adjust rudeness based on the spend thresholds.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: SCHEMA,
        temperature: 0.8,
      },
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("No response from Gemini.");
    }

    return JSON.parse(textResponse) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};