import { GoogleGenAI, Type } from "@google/genai";
import { CollabStrategy } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCollabStrategy = async (
  name: string,
  niche: string,
  city: string
): Promise<CollabStrategy> => {
  
  const prompt = `
    Act as a viral content strategist for "Creator Connect".
    
    User: ${name}
    Niche: ${niche}
    Target Destination: ${city}

    The user is traveling to this city. 
    1. Suggest 3 types of LOCAL creators they should collaborate with to grow their audience (e.g., if they are a food vlogger in Tokyo, suggest a local sushi chef or street food guide).
    2. Create ONE specific, high-viral-potential content idea they could film together in that city.
    3. Suggest 3 types of local businesses (e.g., Nightclubs, Fine Dining, Malls, Boutique Hotels) they could pitch for Sponsored Collaborations (VIP access, dining, stays for content).
    4. Write a short, hype-filled welcome message (max 15 words) welcoming them as a "Founding Creator".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            match_suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 types of local creators to collab with",
            },
            viral_concept: {
              type: Type.STRING,
              description: "A specific viral content idea for this niche in this city",
            },
            barter_opportunities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 types of local businesses to pitch for barter deals",
            },
            welcome_message: {
              type: Type.STRING,
              description: "Short welcome message",
            },
          },
          required: ["match_suggestions", "viral_concept", "barter_opportunities", "welcome_message"],
        },
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from AI");
    }
    return JSON.parse(text) as CollabStrategy;

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      match_suggestions: ["Local Lifestyle Influencers", "City Photographers", "Hidden Gem Experts"],
      viral_concept: `The Ultimate ${niche} Guide to ${city} with a Local!`,
      barter_opportunities: ["Nightclubs", "Luxury Malls", "Fine Dining Restaurants"],
      welcome_message: `Welcome ${name}! You're officially a Founding Creator.`
    };
  }
};