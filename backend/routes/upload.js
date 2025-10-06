import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

// Multer storage setup
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

// Allow only PDF/JPEG/PNG
const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "image/jpeg", "image/png"];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error("Only PDF, JPEG, PNG allowed"));
};

const upload = multer({ storage, fileFilter });

// Upload route
router.post("/upload", upload.fields([
  { name: "rc", maxCount: 1 },
  { name: "insurance", maxCount: 1 },
  { name: "puc", maxCount: 1 },
  { name: "fitness", maxCount: 1 }
]), async (req, res) => {
  try {
    const { vehicleNo, ownerId } = req.body;
    const files = req.files;

    if (!vehicleNo || !ownerId || !files) {
      return res.status(400).json({ message: "All fields are required" });
    }

// Encrypt a file in place and return new filename
function encryptFileSync(filePath) {
  const base64Key = process.env.FILE_ENCRYPTION_KEY;
  if (!base64Key) return null; // encryption disabled if no key
  const key = base64Key.startsWith("base64:") ? Buffer.from(base64Key.slice(7), "base64") : Buffer.from(base64Key, "base64");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const data = fs.readFileSync(filePath);
  const enc = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();
  const out = Buffer.concat([iv, tag, enc]);
  const encPath = filePath + ".enc";
  fs.writeFileSync(encPath, out);
  fs.unlinkSync(filePath);
  return path.basename(encPath);
}

const vehicle = new Vehicle({
      vehicleNo,
      ownerId,
rc: files.rc ? (encryptFileSync(path.join(UPLOAD_DIR, files.rc[0].filename)) || files.rc[0].filename) : undefined,
insurance: files.insurance ? (encryptFileSync(path.join(UPLOAD_DIR, files.insurance[0].filename)) || files.insurance[0].filename) : undefined,
puc: files.puc ? (encryptFileSync(path.join(UPLOAD_DIR, files.puc[0].filename)) || files.puc[0].filename) : undefined,
fitness: files.fitness ? (encryptFileSync(path.join(UPLOAD_DIR, files.fitness[0].filename)) || files.fitness[0].filename) : undefined,
    });

    await vehicle.save();
    res.json({ message: "Documents uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
