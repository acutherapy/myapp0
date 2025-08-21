// server.js
// ===== Basic setup =====
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
app.use(cors());                 // 允许前端跨域访问
app.use(express.json());         // 解析 JSON body

// ===== Upload setup =====
const UPLOAD_DIR = path.join(__dirname, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // 生成安全文件名：upload-时间戳 + 原始后缀（默认 .jpg）
    const ext = path.extname(file.originalname || ".jpg") || ".jpg";
    cb(null, `upload-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_req, file, cb) => {
    // 仅允许图片；如需放宽可去掉这个判断
    if (/^image\//.test(file.mimetype || "")) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});

// 静态访问上传内容：/uploads/<filename>
app.use("/uploads", express.static(UPLOAD_DIR));

// ===== APIs =====

// 健康检查
app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// 随机 tips 的 hello
app.get("/hello", (_req, res) => {
  const TIPS = [
    "hydrate 💧",
    "deep breathe 4-7-8 🌬️",
    "5-min stretch 🧘",
    "sunlight 10min ☀️",
    "walk 1k steps 🚶",
    "smile & relax 🙂",
  ];
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  res.json({ message: "QiPulse says hi ✨", tip });
});

// 问候
app.post("/greet", (req, res) => {
  console.log("POST /greet body:", req.body);
  const { name } = req.body || {};
  res.json({ reply: `Hello, ${name || "friend"} ✨` });
});

// 图片上传（超宽容：接收任意字段名，取第一个文件）
app.post("/upload", upload.any(), (req, res) => {
  const f = req.files && req.files[0];
  if (!f) return res.status(400).json({ error: "no file" });

  console.log("UPLOAD OK:", {
    field: f.fieldname,
    originalname: f.originalname,
    mimetype: f.mimetype,
    size: f.size,
    savedAs: f.filename,
  });

  res.json({
    ok: true,
    filename: f.filename,
    size: f.size,
    mimetype: f.mimetype,
    url: `/uploads/${f.filename}`,
  });
});

// ===== Error handler =====
app.use((err, _req, res, _next) => {
  console.error("ERROR:", err.stack || err.message || err);
  res.status(500).json({ error: err.message || "Server error" });
});

// ===== Start server =====
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API ready at http://localhost:${port}`);
});
