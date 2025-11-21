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
          category: { type: Type.STRING, description: "Life component category. STRICTLY use one of: 'Survival Mode 🏠', 'Future You 🚀', 'Brain Rot 🧠', 'The Flex 💸'." },
          amount: { type: Type.NUMBER },
          currency: { type: Type.STRING },
        },
        required: ["category", "amount", "currency"],
      },
    },
    vibeScore: { type: Type.INTEGER, description: "A score from 0 to 100 indicating financial health." },
    genZVibeLabel: { type: Type.STRING, description: "A 1-3 word slang term for their score (e.g., 'Down Bad', 'Cooking', 'CEO Mindset', 'NPC Behavior')." },
    roastOrToastType: { type: Type.STRING, enum: [ToastType.ROAST, ToastType.TOAST] },
    roastOrToastMessage: { type: Type.STRING, description: "A witty roast or congratulatory toast. If they have high vices spend, call them out!" },
    recommendedProduct: { type: Type.STRING, description: "The specific Freo product to pitch. STRICTLY one of: 'Freo Pay', 'Freo Personal Loan', 'Freo Gold Loan', 'Freo Insurance'." },
    freoTip: { type: Type.STRING, description: "A persuasive pitch explaining WHY this specific product helps them fill their financial gap." },
    personaTitle: { type: Type.STRING, description: "A cool title for the user's financial persona." },
    summaryText: { type: Type.STRING, description: "A short, witty Gen-Z style summary of the spending habits." },
    swapSuggestions: {
      type: Type.ARRAY,
      description: "Real-time life improvement swaps. Replace bad habits with self-improvement.",
      items: {
        type: Type.OBJECT,
        properties: {
            habitToBreak: { type: Type.STRING, description: "The bad spending habit (e.g., 'Ordering Swiggy daily')." },
            betterAlternative: { type: Type.STRING, description: "The better life choice (e.g., 'Gym Membership', 'Coding Course')." },
            projectedImpact: { type: Type.STRING, description: "The result (e.g., 'Glow up + abs', 'Higher salary')." }
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
    You are a ruthless but helpful Gen-Z financial assistant for 'Freo'. 
    Analyze the user's financial profile based on their answers.
    
    USER DATA:
    - Monthly Income: ₹${data.monthlyIncome}
    - Survival Mode (Rent/EMI/Loans): ₹${data.rentAndEmi}
    - Survival Mode (Groceries/Bills): ₹${data.groceries}
    - Potential Brain Rot (Food/Dining/Ordering): ₹${data.foodAndDining}
    - DEFINITE Brain Rot/Vices (Cigs/Alcohol/Vapes): ₹${data.vices}
    - The Flex (Shopping/Fun/Trips): ₹${data.shoppingAndEntertainment}
    - Future You (Investments/SIPs): ₹${data.investments}
    
    GOALS:
    1. **Categorize**: Group the amounts into the 4 Life Components:
       - 'Survival Mode 🏠' = Rent/EMI + Groceries
       - 'Future You 🚀' = Investments
       - 'Brain Rot 🧠' = Food/Dining + Vices (Cigs/Alcohol)
       - 'The Flex 💸' = Shopping + Entertainment
    
    2. **Vibe Score & Label**: 
       - Calculate 0-100. 
       - High Score: >20% in 'Future You'.
       - Low Score: High 'Vices' or >50% in 'Brain Rot' + 'Flex'.
       - Label: Slang (e.g., "Down Bad", "Academic Weapon", "CEO Mindset", "NPC Activity", "Certified Lover Boy").

    3. **The Roast/Toast**: 
       - **CRITICAL**: If 'Vices' (Cigs/Alcohol) > 0, ROAST THEM SPECIFICALLY about it. (e.g., "Bro, your lungs are expensive", "That bar tab could be a mutual fund").
       - If 'Food/Dining' is high: Roast the Swiggy habit.
       - If 'Future You' is high: Toast them ("W").
    
    4. **Real-Time Glow Up Plan (Swaps)**: 
       - If they have Vices, suggest swapping Vices for Health/Wealth.
       - If they order food too much, suggest cooking classes or meal prep.

    5. **Freo Product Match (Crucial)**:
       - **Freo Pay (Pay Later)**: High daily spends (Food, Vices, Small Shopping). Pitch: "Smooth out those daily cravings."
       - **Freo Personal Loan**: If 'Future You' is low, or they need to consolidate 'Flex' debt. Pitch: "Fund a real upgrade (Gym/Course) or clear the mess."
       - **Freo Gold Loan**: If 'Survival Mode' > 60% of Income. Pitch: "Unlock cash from gold for emergencies."
       - **Freo Insurance**: If 'Flex' is high or 'Vices' are high (Health risk). Pitch: "Protect your health & vibe."
       
    Tone: Use Gen Z slang (no cap, fr, bet, cooked, glow up, lock in, opps). Be specific about their inputs.
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