import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log(reqBody);

        // check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        // check if password is correct
        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
        }

        return NextResponse.json({ message: "Login successful" }, { status: 200 });

        // create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1h" });

        const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
        response.cookies.set("token", token, {
            httpOnly: true,
        });
        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
