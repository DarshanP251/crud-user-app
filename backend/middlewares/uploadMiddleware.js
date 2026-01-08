const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* =========================
   ABSOLUTE UPLOAD PATH
========================= */
const uploadPath = path.join(__dirname, "..", "uploads");

// Ensure uploads directory exists (IMPORTANT for Render)
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

/* =========================
   STORAGE CONFIG
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

/* =========================
   FILE FILTER
========================= */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (ext) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, and PNG images are allowed"));
  }
};

/* =========================
   EXPORT MULTER
========================= */
module.exports = multer({
  storage,
  fileFilter
});
