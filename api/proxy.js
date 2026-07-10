// ✅ Переходим на KeylessAI (бесплатный прокси-сервис)
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "keyless", // ← фиктивный ключ, можно любой текст
  baseURL: "https://keylessai.thryx.workers.dev/v1", // ← новый URL
});

export default async function handler(req, res) {
  // CORS-заголовки (оставляем как было)
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

  // Модель по умолчанию – GPT-4o (поддерживается KeylessAI)
  const { messages, model = "gpt-4o" } = body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  try {
    const completion = await client.chat.completions.create({
      model: model,
      messages: messages,
      stream: false,
      // Дополнительные параметры стандартные – можно добавить temperature и т.п.
    });
    return res.status(200).json(completion);
  } catch (error) {
    console.error("KeylessAI API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
