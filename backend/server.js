require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");

const app = express();

/* =========================
   CORS — MUST BE FIRST
========================= */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

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
   STATIC FILES
========================= */
app.use("/uploads", express.static(uploadDir));

/* =========================
   ROUTES
========================= */
app.use("/api/users", require("./routes/userRoutes"));

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("API is running");
});

/* =========================
   GLOBAL ERROR HANDLER
   (CRITICAL FOR CORS + MULTER)
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
