import { Injectable } from '@nestjs/common';
import { prisma } from 'src/utils/prisma';

@Injectable()
export class VerifyemailService {
    async verifyEmail(token: string){
    try {
        const user = await  prisma.users.findFirst({where: {verifyToken: token}});
        if(!user){
            return ({error: "User not found", status: 400});
        }
        console.log(user);
        if(user.verifyTokenExpiry < new Date()){
            return {error: "Token expired", status: 400};
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await prisma.users.update({where: {id: user.id}, data: user});

        return {message: "Email verified successfully"};
        
    } catch (error) {
        return {error: error, status: 500};
    }


    }
}
