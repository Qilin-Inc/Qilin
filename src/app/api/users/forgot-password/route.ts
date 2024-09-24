import { connectDB } from '@/dbconfig/dbconfig';
import User from '@/models/userModel';
import { sendEmail } from '@/helpers/mailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  await connectDB();

  const reqBody = await request.json();
  const { email } = reqBody;

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  await sendEmail({ email, emailType: 'RESET', userId: user._id });

  return NextResponse.json({ message: 'Password reset email sent' }, { status: 200 });
}
