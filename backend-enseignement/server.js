import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import archiver from "archiver";

const app = express();
const PORT = 3000;
function baseUrl(req) {
  return `${req.protocol}://${req.get("host")}`;
}

const BASE_URL = `http://localhost:${PORT}`;

const ROOT = path.resolve(".");
const DATA_DIR = path.join(ROOT, "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads", "enseignement");
const DB_FILE = path.join(DATA_DIR, "teaching.json");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/files", express.static(UPLOAD_DIR, {
  fallthrough: false,
  setHeaders(res) {
    res.setHeader("X-Content-Type-Options", "nosniff");
  }
}));

function readDB() {
  if (!fs.existsSync(DB_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) || [];
  } catch {
    return [];
  }
}

function writeDB(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function uid() {
  return "id_" + Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function safeName(name) {
  return Date.now() + "__" + name.replace(/[^\w.\-()+ ]/g, "_");
}

function allowed(name) {
  const n = name.toLowerCase();
  return n.endsWith(".pdf") || n.endsWith(".ppt") || n.endsWith(".pptx");
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => cb(null, safeName(file.originalname))
});

const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 },
  fileFilter: (_, file, cb) =>
    allowed(file.originalname)
      ? cb(null, true)
      : cb(new Error("Fichier non autorisé"))
});

app.get("/api/teaching", (_, res) => {
  res.json(readDB());
});

app.post("/api/teaching", upload.single("file"), (req, res) => {
  const { title, author, domain } = req.body;
  if (!title || !author || !domain || !req.file) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    return res.status(400).send("Champs manquants");
  }

  const data = readDB();
  const item = {
    id: uid(),
    title,
    author,
    domain,
    addedAt: new Date().toISOString(),
    fileName: req.file.originalname,
    storedName: req.file.filename,
    fileUrl: `${baseUrl(req)}/files/${req.file.filename}`
  };

  data.unshift(item);
  writeDB(data);
  res.json(item);
});

app.put("/api/teaching/:id", upload.single("file"), (req, res) => {
  const data = readDB();
  const item = data.find(d => d.id === req.params.id);
  if (!item) return res.status(404).send("Introuvable");

  item.title = req.body.title || item.title;
  item.author = req.body.author || item.author;
  item.domain = req.body.domain || item.domain;

  if (req.file) {
    if (item.storedName) {
      const old = path.join(UPLOAD_DIR, item.storedName);
      if (fs.existsSync(old)) fs.unlinkSync(old);
    }
    item.fileName = req.file.originalname;
    item.storedName = req.file.filename;
    item.fileUrl = `${baseUrl(req)}/files/${req.file.filename}`;
  }

  writeDB(data);
  res.json(item);
});

app.delete("/api/teaching", (req, res) => {
  const ids = req.body?.ids || [];
  let data = readDB();

  data = data.filter(item => {
    if (ids.includes(item.id)) {
      const p = path.join(UPLOAD_DIR, item.storedName || "");
      if (fs.existsSync(p)) fs.unlinkSync(p);
      return false;
    }
    return true;
  });

  writeDB(data);
  res.json({ ok: true });
});

app.get("/api/teaching/zip", (_, res) => {
  const data = readDB();

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=enseignement.zip");

  const zip = archiver("zip", { zlib: { level: 9 } });
  zip.pipe(res);

  data.forEach(item => {
    const p = path.join(UPLOAD_DIR, item.storedName || "");
    if (fs.existsSync(p)) zip.file(p, { name: item.fileName });
  });

  zip.finalize();
});

app.listen(PORT, () => {
  console.log(`Backend Enseignement actif : http://localhost:${PORT}`);
});
