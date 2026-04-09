const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini API with the new SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/boost', async (req, res) => {
    const { sentence } = req.body;

    if (!sentence) {
        return res.status(400).json({ error: 'Sentence is required' });
    }

    try {
        const prompt = `
            You are a professional resume writer. 
            Improve the following work description into a professional, high-impact resume bullet point.
            Use strong action verbs and include metrics or specific outcomes if possible (use placeholders like [X%] or $[Y] if specific numbers aren't provided but would fit).
            Keep it concise and punchy.
            
            Original: "${sentence}"
            
            Improved bullet point:
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text.trim();

        res.json({ boosted: text });
    } catch (error) {
        console.error('Error boosting sentence:', error);
        res.status(500).json({ error: 'Failed to boost sentence. Please check your API key and try again.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
