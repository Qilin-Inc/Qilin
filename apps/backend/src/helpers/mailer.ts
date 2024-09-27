import * as bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { prisma } from "../utils/prisma";
export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await prisma.users.update({
        where: { id: userId },
        data: {
          verifyToken: hashedToken,
          verifyTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    } else if (emailType === "RESET") {
      await prisma.users.update({
        where: { id: userId },
        data: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    }

    console.log(process.env.MAILTRAP_USER);
    console.log(process.env.MAILTRAP_PASS);
    // const transport = nodemailer.createTransport({
    //   host: "sandbox.smtp.mailtrap.io",
    //   port: 2525,
    //   auth: {
    //     user: process.env.MAILTRAP_USER || '',
    //     pass: process.env.MAILTRAP_PASS || '',
    //   },
    // });
    // const transport = nodemailer.createTransport({});
    console.log("nodemailer: ", nodemailer);

    const resetUrl = `${process.env.DOMAIN}/reset-password?token=${hashedToken}`;

    const mailOptions = {
      from: 'sikak1337@gmail.com',
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${resetUrl}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy and paste the link below in your browser. ${resetUrl}</p>`,
    };

    // const mailResponse = await transport.sendMail(mailOptions);
    // return mailResponse;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};