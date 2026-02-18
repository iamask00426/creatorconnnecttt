import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const getNearbyLocations = async (city: string): Promise<string[]> => {
    if (!city || !API_KEY) return [];

    try {
        const prompt = `List 15 cities, towns, or major neighborhoods that are geographically close to "${city}". 
        Include the city itself.
        Return ONLY the names separated by commas. 
        Example Output: Noida, Delhi, Ghaziabad, Faridabad, Greater Noida, Gurgaon`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse comma-separated list
        const locations = text.split(',')
            .map(s => s.trim().toLowerCase())
            .filter(s => s.length > 0);

        // Deduplicate
        return Array.from(new Set(locations));
    } catch (error) {
        console.error("Gemini Location Error:", error);
        return [];
    }
};
