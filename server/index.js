import express from "express";
import cors from "cors";
import OpenAI from "openai";

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
            You are an agricultural expert specializing in plant diseases.

            Given the detected disease: **${disease}**

            Provide:
            1. A short explanation of the disease  
            2. Causes (2 short causes) 
            3. Symptoms (a few symptoms) 
            4. Step-by-step remedies (affordable for farmers in Africa)  
            5. Prevention methods  

            Format clearly with headings.
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
