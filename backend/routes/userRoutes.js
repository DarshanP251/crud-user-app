const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser
} = require("../controllers/userController");

router.post("/", upload.single("photo"), createUser);
router.get("/", getUsers);
router.put("/:id", upload.single("photo"), updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
