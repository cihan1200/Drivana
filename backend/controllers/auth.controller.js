import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "drivana_secret_key",
      { expiresIn: "7d" },
    );

    res.status(201).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong during registration.",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "drivana_secret_key",
      { expiresIn: "7d" },
    );

    res.status(200).json({ result: user, token });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong during login.",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, location, profilePhoto } = req.body;
    const existingUser = await User.findOne({ email, _id: { $ne: id } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email is already in use by another account." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullName, email, phone, location, profilePhoto },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const { password, ...rest } = updatedUser._doc;

    res
      .status(200)
      .json({ result: rest, message: "Profile updated successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong updating the profile.",
      error: error.message,
    });
  }
};
