require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");

const app = express();

/* =========================
   ENSURE UPLOADS FOLDER
========================= */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* =========================
   CONNECT DATABASE
========================= */
connectDB();

/* =========================
   BODY PARSERS
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC UPLOADS
========================= */
app.use("/uploads", express.static(uploadDir));

/* =========================
   API ROUTES
========================= */
app.use("/api/users", require("./routes/userRoutes"));

/* =========================
   SERVE FRONTEND (STATIC)
========================= */
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({
    message: err.message || "Internal Server Error"
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
