export default function handler(req, res) {
  const tips = [
    "hydrate 💧",
    "deep breathe 4-7-8 🌬️",
    "5-min stretch 🧘",
    "sunlight 10min ☀️",
    "walk 1k steps 🚶",
    "smile 🙂",
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).json({ message: "QiPulse says hi ✨", tip });
}
