// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.json());

// 确保 uploads 目录存在
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// 配置 Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = path.basename(file.originalname || "upload", ext);
    cb(null, `${base}-${Date.now()}${ext || ".jpg"}`);
  },
});
const upload = multer({ storage });

// 随机 tips 池
const TIPS = [
  "hydrate 💧",
  "deep breathe 4-7-8 🌬️",
  "5-min stretch 🧘",
  "sunlight 10min ☀️",
  "walk 1k steps 🚶",
  "smile & relax 🙂",
];

// /hello：每次返回一个随机 tip
app.get("/hello", (_req, res) => {
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  res.json({ message: "QiPulse says hi ✨", tip });
});

// /greet：记得你已经有了
app.post("/greet", (req, res) => {
  console.log("POST /greet body:", req.body);
  const { name } = req.body || {};
  res.json({ reply: `Hello, ${name || "friend"} ✨` });
});

// /upload：接收图片
app.post("/upload", upload.single("file"), (req, res) => {
  // req.file 包含 { filename, path, mimetype, size, ... }
  if (!req.file) return res.status(400).json({ error: "no file" });
  const publicUrl = `/uploads/${req.file.filename}`;
  res.json({
    ok: true,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
    url: publicUrl,
  });
});

// 提供静态访问上传文件
app.use("/uploads", express.static(UPLOAD_DIR));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API ready at http://localhost:${port}`));
