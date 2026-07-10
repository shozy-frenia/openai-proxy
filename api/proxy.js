// ✅ Переходим на DeepSeek API
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY, // ← меняем имя переменной
  baseURL: "https://api.deepseek.com",   // ← меняем URL
});

export default async function handler(req, res) {
  // CORS-заголовки (те же)
  res.setHeader("Access-Control-Allow-Origin", "https://shozy-frenia.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { messages, model = "deepseek-v4-flash" } = body; // ← модель DeepSeek

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  try {
    const completion = await client.chat.completions.create({
      model: model,
      messages: messages,
      stream: false,
      // Дополнительные параметры DeepSeek (опционально)
      thinking: { type: "enabled" },      // Включаем режим мышления[citation:1]
      reasoning_effort: "high",            // Уровень усилий при рассуждении[citation:5]
    });
    return res.status(200).json(completion);
  } catch (error) {
    console.error("DeepSeek API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
