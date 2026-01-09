const User = require("../models/User");
const mongoose = require("mongoose");

/* =========================
   CREATE USER
========================= */
exports.createUser = async (req, res) => {
  try {
    const { name, dob, email, mobile } = req.body;

    if (!name || !dob || !email || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        message: "Mobile number must be exactly 10 digits"
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Photo is required" });
    }

    const user = await User.create({
      name,
      dob,
      email,
      mobile,
      photo: req.file.filename
    });

    res.status(201).json(user);

  } catch (error) {
    // 🔥 HANDLE DUPLICATE EMAIL
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(409).json({
        message: "User with this email already exists"
      });
    }

    console.error("CREATE USER ERROR:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

/* =========================
   READ USERS
========================= */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
};

/* =========================
   UPDATE USER
========================= */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    const updatedData = req.body;

    // Validate mobile if present
    if (updatedData.mobile && !/^\d{10}$/.test(updatedData.mobile)) {
      return res.status(400).json({
        message: "Mobile number must contain exactly 10 digits"
      });
    }

    // Update photo if uploaded
    if (req.file) {
      updatedData.photo = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user"
    });
  }
};

/* =========================
   DELETE USER
========================= */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user"
    });
  }
};
