import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API key found in .env");
    process.exit(1);
}

console.log("Using API Key:", apiKey.substring(0, 10) + "...");

const testModel = async (modelName) => {
    console.log(`\n--- Testing ${modelName} ---`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`✅ SUCCESS [${modelName}]:`, data.candidates?.[0]?.content?.parts?.[0]?.text);
            return true;
        } else {
            console.error(`❌ FAILED [${modelName}]:`, data.error?.message || data);
            return false;
        }
    } catch (e) {
        console.error(`ERROR [${modelName}]:`, e.message);
        return false;
    }
};

const main = async () => {
    // 1. List Models
    try {
        console.log("\n--- Listing Models (v1beta) ---");
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available models (first 10):");
            const models = data.models.map(m => m.name.replace('models/', ''));
            console.log(models.slice(0, 10));
        }
    } catch (e) {
        console.error("List Models Error:", e.message);
    }

    // 2. Test Candidates
    await testModel('gemini-2.5-pro');
};

main();
