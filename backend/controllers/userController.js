const User = require("../models/User");

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { name, dob, email, mobile } = req.body;

    // Validate required fields
    if (!name || !dob || !email || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate mobile number (only digits, exactly 10)
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        message: "Mobile number must contain exactly 10 digits"
      });
    }

    // Validate photo
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
    res.status(500).json({ message: error.message });
  }
};

// READ USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const updatedData = req.body;

    // Validate mobile if present
    if (updatedData.mobile) {
      if (!/^\d{10}$/.test(updatedData.mobile)) {
        return res.status(400).json({
          message: "Mobile number must contain exactly 10 digits"
        });
      }
    }

    // Update photo if uploaded
    if (req.file) {
      updatedData.photo = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
