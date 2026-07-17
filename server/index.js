require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ── Prompt builder ─────────────────────────────────────────────────────────────
function buildPrompt(text, mode) {
  const cardCount = mode === "quick" ? 6 : mode === "exam" ? 15 : 10;
  return `You are a study assistant. Given the following notes or topic, generate ${cardCount} flashcards AND ${cardCount} multiple-choice quiz questions.

TOPIC/NOTES:
${text}

Return ONLY valid JSON — no markdown, no code fences, no explanation. Use this exact shape:
{
  "topic": "<short topic title>",
  "cards": [
    {
      "id": "card_1",
      "question": "<question>",
      "answer": "<concise answer>",
      "explanation": "<1-2 sentence deeper explanation>"
    }
  ],
  "quiz": [
    {
      "id": "q_1",
      "question": "<question>",
      "options": ["<A>", "<B>", "<C>", "<D>"],
      "correct": <0-3 index of correct option>,
      "explanation": "<why this is correct>"
    }
  ]
}`;
}

// ── Gemini call ────────────────────────────────────────────────────────────────
async function callGemini(prompt, customKey) {
  const key = customKey || process.env.GEMINI_API_KEY;
  if (!key) throw new Error("No Gemini API key provided.");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  // Strip any accidental markdown fences
  return text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
}

// ── Groq call ──────────────────────────────────────────────────────────────────
async function callGroq(prompt, customKey) {
  const key = customKey || process.env.GROQ_API_KEY;
  if (!key) throw new Error("No Groq API key provided.");
  const groq = new Groq({ apiKey: key });
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });
  const text = completion.choices[0]?.message?.content || "";
  return text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
}

// ── Main route ─────────────────────────────────────────────────────────────────
app.post("/api/generate", async (req, res) => {
  const { text, mode = "deep" } = req.body;
  const customGeminiKey = req.headers["x-gemini-key"];
  const customGroqKey = req.headers["x-groq-key"];

  if (!text || text.trim().length < 5) {
    return res.status(400).json({ error: "Please provide at least a short topic or notes." });
  }

  const prompt = buildPrompt(text.trim(), mode);
  let rawText = null;
  let usedProvider = null;

  // Try Gemini first
  try {
    rawText = await callGemini(prompt, customGeminiKey);
    usedProvider = "gemini";
  } catch (geminiErr) {
    console.warn("Gemini failed, trying Groq:", geminiErr.message);
    // Fallback to Groq
    try {
      rawText = await callGroq(prompt, customGroqKey);
      usedProvider = "groq";
    } catch (groqErr) {
      console.error("Both providers failed:", groqErr.message);
      return res.status(502).json({
        error: "Both AI providers failed. Please check your API keys or try again.",
        detail: groqErr.message,
      });
    }
  }

  // Parse JSON
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return res.status(422).json({
      error: "The AI returned malformed JSON. Please retry.",
      raw: rawText.slice(0, 500),
    });
  }

  // Basic shape check
  if (!parsed.cards || !Array.isArray(parsed.cards) || parsed.cards.length === 0) {
    return res.status(422).json({
      error: "The AI returned an unexpected response shape. Please retry.",
      raw: rawText.slice(0, 500),
    });
  }

  return res.json({ ...parsed, provider: usedProvider });
});

app.listen(PORT, () => {
  console.log(`Punch AI server running on http://localhost:${PORT}`);
});
