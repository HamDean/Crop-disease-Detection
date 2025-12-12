import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/recommend", async (req, res) => {
  try {
    const { disease } = req.body;
    const prompt = `
      You are an agricultural expert speaking to a farmer in Africa.
      
      The detected plant disease is: ${disease}
      
      Write a simple, conversational response (2-3 paragraphs each should be short, like 1-2 sentences) that includes:
      - What the disease is and what causes it
      - What symptoms to look for
      - How to treat it with affordable, accessible methods
      - How to prevent it in the future
      
      Write in simple, clear language as if you're talking directly to the farmer.
      Do NOT use bullet points, headings, or formatting. Just write natural paragraphs. (keep the response short)
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ remedies: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate remedies" });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
