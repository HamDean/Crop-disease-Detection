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

        Their crop has been diagnosed with: ${disease}

        First, inform the farmer of the disease. Example(From the image you uploaded, it appears your crop is infected with ___).
        Then, in 2 - 3 sentences, explain:
        1. the cause of the disease
        2. How to treat it affordably
        3. How to prevent it

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
