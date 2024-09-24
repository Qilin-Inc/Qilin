import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbconfig/dbconfig";
import User from "@/models/userModel"

connectDB()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {token} = reqBody;
        console.log(token);

        const user = await  User.findOne({verifyToken: token});
        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 400});
        }

        console.log(user);

        if(user.verifyTokenExpiry < Date.now()){
            return NextResponse.json({error: "Token expired"}, {status: 400});
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({message: "Email verified successfully"});
        
    } catch (error) {
        
    }
}
