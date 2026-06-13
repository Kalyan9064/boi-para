const express = require("express");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate-description", async (req, res) => {
    try {
        const { title, author, category, condition } = req.body;

        // Validation
        if (!title || !author) {
            return res.status(400).json({
                message: "Title and author are required.",
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `
Write a simple description for a used book listing.

Book Title: ${title}
Author: ${author}
Category: ${category || "Not specified"}

Instructions:
- Explain what the book is about in simple English.
- Use an easy and natural tone.
- Do not sound like an advertisement.
- Avoid exaggerated words like "thrilling", "captivating", "must-read", or "life-changing".
- Keep it between 40 and 80 words.
- Write in a way that an average reader can quickly understand whether the book interests them.
- Do not use bullet points or markdown.
`;

        const result = await model.generateContent(prompt);

        const generatedText = result.response.text();

        res.json({
            description: generatedText,
        });

    } catch (error) {
        console.error("AI Error:", error);

        res.status(500).json({
            message: "Failed to generate description.",
        });
    }
});

module.exports = router;