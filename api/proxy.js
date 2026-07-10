import OpenAI from "openai";

// Подключаемся к FreeTheAi
const client = new OpenAI({
  apiKey: "sta_168e543e2288b6f38f2d47f8f9f162999b6f45c393c37430", // ← ваш ключ
  baseURL: "https://api.freetheai.xyz/v1", // ← правильный URL для FreeTheAi
});

export default async function handler(req, res) {
  // CORS-заголовки
  res.setHeader("Access-Control-Allow-Origin", "*"); // Для теста можно *, позже замените на ваш домен
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Обработка preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Разрешаем только POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Парсим тело запроса
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

  try {
    console.log("📤 Отправка запроса в FreeTheAi...");
    const completion = await client.chat.completions.create({
      model: model,
      messages: messages,
      stream: false,
    });
    console.log("📥 Ответ получен");
    return res.status(200).json(completion);
  } catch (error) {
    console.error("❌ Ошибка FreeTheAi:", error);
    return res.status(500).json({ error: error.message });
  }
}
