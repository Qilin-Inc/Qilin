import { connectDB } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { userId, otp } = reqBody;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "Invalid verification link." }, { status: 400 });
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp || Date.now() > user.otpExpiry) {
      return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 400 });
    }

    // Mark email as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully. You can now log in.",
      success: true,
    });
  } catch (error: any) {
    console.error("OTP Verification Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}