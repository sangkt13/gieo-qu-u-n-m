import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "Missing message" });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: "Bạn là trợ lý tiếng Việt, trả lời ngắn gọn, rõ ràng." },
        { role: "user", content: message }
      ],
    });

    // Lấy text output
    const text =
      resp.output_text ||
      (resp.output?.[0]?.content?.map(c => c.text).join("") ?? "");

    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: "Server error", detail: String(e?.message || e) });
  }
}
