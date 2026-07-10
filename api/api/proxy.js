import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Добавляем CORS-заголовки для доступа с вашего сайта
  res.setHeader("Access-Control-Allow-Origin", "https://shozy-frenia.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Обрабатываем preflight-запрос (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { messages, model = "gpt-4o-mini" } = body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  // Проверяем, есть ли у пользователя доступ (опционально)
  // Можно добавить проверку токена из localStorage

  try {
    const completion = await client.chat.completions.create({
      model: model,
      messages: messages,
      stream: false, // Для простоты — без стриминга
    });

    return res.status(200).json(completion);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
