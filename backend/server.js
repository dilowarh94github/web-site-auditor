import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';
import https from 'https';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini AI Client
const ai = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY );
// Tool: Axios + Cheerio Scraper function
async function scrapeSiteData(targetUrl) {
    try {
        const { data } = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000,
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        const $ = cheerio.load(data);
        $('script, style, svg, iframe, noscript').remove();
        //return $.html(); // Remove scripts to avoid noise

        //Core data extraction
        return {
            url: targetUrl,
            title: $('title').text().trim() || 'Missing Title',
            metaDescription: $('meta[name="description"]').attr('content')?.trim() || 'Missing Description',
            h1s: $('h1').map((_, el) => $(el).text().trim()).get(),
            h2s: $('h2').map((_, el) => $(el).text().trim()).get().slice(0, 10), // Limit to avoid blowing context windows
            totalImages: $('img').length,
            imagesWithoutAlt: $('img:not([alt])').length,
            isReactShell: ($('#root').length > 0 || $('#app').length > 0) && $('body').text().trim().length < 200
        };
    } catch (err) {
        throw new Error(`Failed to read website structure: ${err.message}`);
    }
}

// Agent Core Endpoint
app.post('/api/audit', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Target URL is required" });

    try {
        const structuralData = await scrapeSiteData(url);
        //console.log("Scraped Structural Data:", structuralData);
        // if (structuralData){
        //     return res.json({ success: true, data: structuralData });
        // }

        // // Fail early warning if it's an empty client-side app shell
        // if (structuralData.isReactShell) {
        //     return res.json({
        //         success: true,
        //         warning: "Client-side React app detected. Axios + Cheerio found an empty shell wrapper.",
        //         audit: [{
        //             category: "Framework Architecture",
        //             issue: "Client-side rendering shell hidden from static parsers.",
        //             severity: "High",
        //             fix: "Configure your site for Server-Side Rendering (SSR) using Next.js or use dynamic pre-rendering to optimize SEO crawlability."
        //         }]
        //     });
        // }

        // 2. Load Agent Procedural Rules (SKILL.md)
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const skillPath = path.resolve(__dirname, 'skills', 'web-site-auditor', 'SKILL.md');
        const skillInstructions = fs.readFileSync(skillPath, 'utf-8');
        //console.log("Loaded Skill Instructions:", skillInstructions);

        // 3. Assemble Core Context prompt
        const systemPrompt = `You are a strict data processing agent. Execute your instructions based exactly on this procedural file:\n\n${skillInstructions}`;
        const userPrompt = `Analyze the structural scraping payload below:\n${JSON.stringify(structuralData)}`;

        // 4. Fire prompt to LLM Model
        //const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        console.log("Gemini AI Client Initialized with API Key:", process.env.VITE_GEMINI_API_KEY);

        const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nInput Data:\n${userPrompt}` }] }]
        });

        // 5. Sanitize text block ticks and return array
        const textPayload = result.response.text();
        const cleanedJson = textPayload.replace(/```json|```/g, '').trim();

        res.json({ success: true, audit: JSON.parse(cleanedJson) });

    } catch (error) {
        res.status(500).json({ error: "Agent routing cycle failed", details: error.message });
    }
});

app.listen(5000, () => console.log('Agent server handling requests on port 5000'));
