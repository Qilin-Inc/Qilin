import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/dbconfig/dbconfig';
import User from '@/models/userModel';

export async function POST(request: Request) {
  await connectDB();

  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      console.error('Token and new password are required');
      return NextResponse.json({ message: 'Token and new password are required' }, { status: 400 });
    }

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gte: Date.now() },
    });

    if (!user) {
      console.error('Invalid or expired token');
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
