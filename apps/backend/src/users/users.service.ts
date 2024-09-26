import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { prisma } from 'src/utils/prisma';
import * as bcrypt from 'bcryptjs';
import { sendEmail } from 'src/helpers/mailer';

@Injectable()
export class UsersService {


    async createUser(body: any) {
    try {
        console.log("called", body);
        const { username, email, password } = body;
        console.log(body);

        const user = await prisma.users.findUnique({ where: { email } });

        if (user) {
            throw new ConflictException("User already exists");
        }       

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const savedUser = await prisma.users.create({
            data: {
                username,
                password: hashedPassword,
                verifyToken: '',
                verifyTokenExpiry: new Date(),
                isAdmin: false,
                isVerified: false,
                v: 0,
                email,
            },
        });
        console.log(savedUser);
        return {
            message: "User created successfully",
            success: true,
            savedUser,
        };
    } catch (error: any) {
        throw new InternalServerErrorException(error.message);
    }
}
}
