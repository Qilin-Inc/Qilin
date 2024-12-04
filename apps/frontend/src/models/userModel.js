import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  isBanned: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN", "MANAGER"],
    default: "USER",
  },
  rating: {
    type: Number,
    default: 5,
  },
  numberOfRatings: {
    type: Number,
    default: 1,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
