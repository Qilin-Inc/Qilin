import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from 'src/helpers/prisma';
import * as bcrypt from 'bcryptjs';
import { sendEmail } from 'src/helpers/mailer';
import axios from 'axios';

@Injectable()
export class UsersService {
  async createUser(body: any) {
    try {
      console.log('called', body);
      const { username, email, password } = body;
      console.log(body);

      const user = await prisma.users.findUnique({ where: { email } });

      if (user) {
        throw new ConflictException('User already exists');
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
      await sendEmail({ email, emailType: 'VERIFY', userId: savedUser.id });
      return {
        message: 'User created successfully',
        success: true,
        savedUser,
      };
    } catch (error: any) {
      console.error('from user service', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async connectUser(body: any) {
    try {
      console.log('called', body);
      const { userId, username, tag } = body;
      const valorantApiUrl = `https://api.henrikdev.xyz/valorant/v2/account/${username}/${tag}`;
      const response = await axios.get(valorantApiUrl, {
        headers: {
          Authorization: `${process.env.HDEV_API_KEY}`,
        },
      });

      if (response.data && response.data.status === 200) {
        console.log('Valorant account connected:', response.data.data);
        const valorantAccount = await prisma.valorantUser.create({
          data: {
            username,
            tag,
            puuid: response.data.data.puuid,
            region: response.data.data.region,
            accountLevel: response.data.data.account_level,
            userId,
          },
        });
        // await prisma.users.update({
        //   where: { id: userId },
        //   data: { valorantAccountId: valorantAccount.id },
        // });
        return {
          message: 'Valorant account connected successfully',
          success: true,
          accountData: response.data.data,
        };
      } else {
        throw new Error('Failed to connect Valorant account');
      }
    } catch (error: any) {
      console.error('from user service', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllUsers() {
    try {
      const users = await prisma.users.findMany();
      return {
        message: 'Users fetched successfully',
        success: true,
        users,
      };
    } catch (error: any) {
      console.error('from user service', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async banUser(id: string) {
    try {
      const user = await prisma.users.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const deletedUser = await prisma.users.delete({
        where: { id },
      });
      return {
        message: 'User banned successfully',
        success: true,
        user: deletedUser,
      };
    } catch (error: any) {
      console.error('from user service', error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
