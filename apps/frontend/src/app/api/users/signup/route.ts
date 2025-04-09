import { connectDB } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { sendOTP } from "@/helpers/mailer";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    const savedUser = await newUser.save();

    // Send OTP to user's email using Resend
    await sendOTP({ email, otp, userId: savedUser._id.toString() });

    return NextResponse.json({
      message: "OTP sent to your email. Please verify your email.",
      success: true,
      userId: savedUser._id.toString(), // Return userId for redirection
    });
  } catch (error: any) {
    console.error("Signup Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}