import { connectDB } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { sendOTP } from "@/helpers/mailer";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { userId } = reqBody;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP to user's email using Resend
    await sendOTP({ email: user.email, otp, userId: user._id.toString() });

    return NextResponse.json({
      message: "New OTP sent to your email. Please verify your email.",
      success: true,
    });
  } catch (error: any) {
    console.error("Resend OTP Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}