import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTP = async ({ email, otp, userId }: { email: string; otp: string; userId: string }) => {
  try {
    const verificationUrl = `${process.env.DOMAIN}/verify-otp?userId=${userId}`;

    const { data, error } = await resend.emails.send({
      from: "no-reply@transactional.chaitanya.fun", // Replace with your verified domain in Resend
      to: email,
      subject: "Verify Your Email",
      html: `
        <p>Your OTP is: <b>${otp}</b>. Please enter this code to verify your email.</p>
        <p>If you are unable to verify manually, click the link below:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error: any) {
    console.error("Failed to send OTP via email:", error.message);
    throw new Error(error.message || "Failed to send OTP via email.");
  }
};