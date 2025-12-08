import { GoogleGenAI, Type } from "@google/genai";
import { ToastType } from "../types";

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
    genZVibeLabel: { type: Type.STRING, description: "A 1-3 word descriptive title for their financial style. e.g. 'Financial Guru', 'Impulse Buyer'. No offensive slang." },
    roastOrToastType: { type: Type.STRING, enum: [ToastType.ROAST, ToastType.TOAST] },
    roastOrToastMessage: { type: Type.STRING, description: "A witty observation or congratulatory message. Professional but engaging. NO insults." },
    recommendedProduct: { type: Type.STRING, description: "The specific Freo product recommendation." },
    freoTip: { type: Type.STRING, description: "A helpful pitch explaining WHY this specific product helps them. Includes insurance advice if applicable." },
    personaTitle: { type: Type.STRING, description: "A creative title for the user's financial persona." },
    summaryText: { type: Type.STRING, description: "A short, witty summary of the spending habits." },
    swapSuggestions: {
      type: Type.ARRAY,
      description: "Real-time life improvement swaps. Replace expensive habits with smarter choices.",
      items: {
        type: Type.OBJECT,
        properties: {
            habitToBreak: { type: Type.STRING, description: "The spending habit." },
            betterAlternative: { type: Type.STRING, description: "The smarter choice." },
            projectedImpact: { type: Type.STRING, description: "The benefit." }
        }
      }
    }
  },
  required: ["spendSummary", "vibeScore", "genZVibeLabel", "roastOrToastType", "roastOrToastMessage", "recommendedProduct", "freoTip", "personaTitle", "summaryText", "swapSuggestions"],
};

export const analyzeFinancialData = async (
  data
) => {
  const ai = getClient();

  const prompt = `
    You are a witty, helpful, and professional financial assistant for 'Freo'. 
    Analyze the user's financial profile based on their answers.
    
    USER DATA:
    - Monthly Income (includes Pocket Money): ₹${data.monthlyIncome}
    - Survival Mode (Rent/EMI/Loans): ₹${data.rentAndEmi}
    - Survival Mode (Groceries/Bills): ₹${data.groceries}
    - Leisure (Food/Dining): ₹${data.foodAndDining}
    - Leisure (Vices/Cigs/Alcohol): ₹${data.vices}
    - The Flex (Shopping/Fun/Trips): ₹${data.shoppingAndEntertainment}
    - Future You (Investments/SIPs): ₹${data.investments}
    - Has Insurance: ${data.hasInsurance}
    
    LOGIC GUARDRAILS & EDGE CASES:
    1. **Expenses > Income**: If total spending exceeds income, label them as "Living Beyond Means" or "Debt Mode" and lower the score drastically (0-30). Be empathetic but firm.
    2. **Zero Expenses**: If categories have 0 spend, do NOT assume they are "saving". Mention it wittily (e.g. "Living rent-free? Lucky you.").
    3. **Tone Check**: 
       - IF (Food/Dining <= 3000 AND Vices <= 2000): Use a gentler, more encouraging tone ("Keep it up!").
       - IF (Food/Dining > 3000 OR Vices > 2000): Be more open and direct about the waste ("Reality check time").

    GOALS:
    1. **Categorize**: Group the amounts into the 4 Life Components:
       - 'Survival Mode 🏠' = Rent/EMI + Groceries
       - 'Future You 🚀' = Investments
       - 'Leisure 🏖️' = Food/Dining + Vices + Shopping + Entertainment
       - 'The Flex 💸' = Any specifically high luxury spend, otherwise merge into Leisure.
    
    2. **Vibe Score & Label**: 
       - Calculate 0-100. 
       - Label: Use universal, descriptive terms (e.g., "Budget Pro", "Carefree Spender", "Balanced Planner"). 
       - STRICTLY NO obscure Gen-Z slang (like "Down Bad" or "NPC"). Make it understandable for ages 18-60.
       - STRICTLY NO punctuation in the label (No '!').

    3. **Tone & Language Guidelines**: 
       - **Tone**: Witty, engaging, and professional. Think "smart financial coach".
       - **Prohibited**: Do NOT use offensive, abusive, or rude language. Do not insult the user.
       - **Critique**: If spending is bad, provide a "Reality Check" rather than a mean roast. Be constructive.
       - **Context**: If income is low (likely pocket money), adjust advice to be age-appropriate (e.g., suggesting small savings vs big investments).
       
    4. **Freo Product Match (Smart Logic)**:
       - **Step 1: Determine Base Product**:
         - **Freo Pay**: High daily small spends (Food, Dining).
         - **Freo Personal Loan**: High big-ticket spend, debt consolidation needs, or if Expenses > Income.
         - **Freo Gold Loan**: High survival costs (needs liquidity).
         - **Freo Gold** (Digital Gold): If they have surplus but no investments (Low 'Future You' score).
       
       - **Step 2: Insurance Logic (Add-on)**:
         - IF 'Has Insurance' is 'no': 
           - **Action**: You MUST recommend the Base Product AND Freo Insurance together.
           - **Output Format**: "{Base Product} + Freo Insurance"
           - **Tip Text**: Pitch the base product first, then add a polite but firm nudge: "Also, securing your future is non-negotiable—consider adding Freo Insurance."
         - IF 'Has Insurance' is 'yes':
           - Recommend just the Base Product.

    5. **Swaps**:
       - Suggest practical changes (e.g., "Home cooking" vs "Ordering out").

    Tone: Common, accessible English. No slang that requires a dictionary.
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
        temperature: 0.7,
      },
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("No response from Gemini.");
    }

    return JSON.parse(textResponse);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};