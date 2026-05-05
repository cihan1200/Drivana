import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    profilePhoto: { type: String, default: "" },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
