export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
    const name = body?.name || "friend";
    return res.status(200).json({ reply: `Hello, ${name} ✨` });
  } catch (e) {
    return res.status(400).json({ error: "Bad JSON" });
  }
}

