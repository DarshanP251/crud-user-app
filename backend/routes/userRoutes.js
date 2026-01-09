const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser
} = require("../controllers/userController");

/* =========================
   CRUD ROUTES
========================= */

// CREATE
router.post("/", upload.single("photo"), createUser);

// READ
router.get("/", getUsers);

// UPDATE
router.put("/:id", upload.single("photo"), updateUser);

// DELETE
router.delete("/:id", deleteUser);

module.exports = router;
