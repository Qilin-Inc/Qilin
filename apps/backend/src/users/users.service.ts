import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { prisma } from 'src/helpers/prisma';
import * as bcrypt from 'bcryptjs';
import { sendEmail } from 'src/helpers/mailer';
import axios from 'axios';
import { TransformationType } from 'class-transformer';

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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async connectUser(body: any) {
    try {
      console.log('called', body);
      const { userId, username, tag } = body;

      const valorantUser = await prisma.valorantUser.findUnique({
        where: { userId },
      });

      if (valorantUser) {
        throw new ConflictException('Valorant account already connected');
      }

      const valorantApiUrl = `https://api.henrikdev.xyz/valorant/v2/account/${username}/${tag}`;
      const response = await axios.get(valorantApiUrl, {
        headers: {
          Authorization: `${process.env.HDEV_API_KEY}`,
        },
      });
      const valorantApiRankUrl = `https://api.henrikdev.xyz/valorant/v3/by-puuid/mmr/ap/pc/${response.data.data.puuid}`;
      const rankData = await axios.get(valorantApiRankUrl, {
        headers: {
          Authorization: `${process.env.HDEV_API_KEY}`,
        },
      });
      const rank = rankData.data.data.current.tier.name;

      if (response.data && response.data.status === 200) {
        console.log('Valorant account connected:', response.data.data);
        const cardId = response.data.data.card;
        const card = await prisma.card.create({
          data: {
            small: `https://media.valorant-api.com/playercards/${cardId}/smallart.png`,
            large: `https://media.valorant-api.com/playercards/${cardId}/largeart.png`,
            wide: `https://media.valorant-api.com/playercards/${cardId}/wideart.png`,
          },
        });
        const valorantAccount = await prisma.valorantUser.create({
          data: {
            username,
            tag,
            puuid: response.data.data.puuid,
            region: response.data.data.region,
            accountLevel: response.data.data.account_level,
            rank,
            cardId: card.id,
            mmr: rankData.data.data.current.elo,
            userId,
          },
        });
        return {
          message: 'Valorant account connected successfully',
          success: true,
          accountData: valorantAccount,
        };
      } else {
        throw new Error('Failed to connect Valorant account');
      }
    } catch (error: any) {
      console.error('from user service', error);
      if (error instanceof HttpException) {
        throw error;
      }
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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async banUser(id: string, adminId: string) {
    try {
      const admin = await prisma.users.findUnique({ where: { id: adminId } });
      if (admin.role !== 'ADMIN') {
        throw new UnauthorizedException(
          'User not authorized to perform this action',
        );
      }
      const user = await prisma.users.update({
        where: { id },
        data: {
          isBanned: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        message: 'User banned successfully',
        success: true,
        user,
      };
    } catch (error: any) {
      console.error('from user service', error);
      if (error.status === 404) {
        throw new NotFoundException(error.message);
      } else if (error.status === 401) {
        throw new UnauthorizedException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async matchmakeValorant(id: any) {
    try {
      const valorantUser = await prisma.valorantUser.findUnique({
        where: { userId: id },
      });

      if (!valorantUser) {
        throw new NotFoundException('Valorant account not found');
      }

      const mmr = valorantUser.mmr;
      const allPlayers = await prisma.valorantUser.findMany();
      let closestUsers = allPlayers
        .map((user) => ({
          ...user,
          distance: Math.abs(user.mmr - mmr),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 4);
      closestUsers = closestUsers.filter((user) => user.userId !== id);

      const updatedUsers = [];
      for (const { distance, ...rest } of closestUsers) {
        const user = await prisma.users.findUnique({
          where: { id: rest.userId },
        });
        updatedUsers.push({
          name: user.username,
          ...rest,
        });
      }

      return {
        message: 'Matchmaking successful',
        success: true,
        updatedUsers,
      };
    } catch (error: any) {
      console.error('Matchmaking Error: \n', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getValoDetails(id: string) {
    try {
      const valorantUsers = await prisma.valorantUser.findUnique({
        where: {
          userId: id,
        },
      });

      if (!valorantUsers) {
        throw new NotFoundException('Valorant account not found');
      }

      const card = await prisma.card.findUnique({
        where: { id: valorantUsers.cardId },
      });

      delete valorantUsers.cardId;

      const final = {
        ...valorantUsers,
        card,
      };
      return {
        message: 'Valorant users fetched successfully',
        success: true,
        final,
      };
    } catch (error: any) {
      if (error.status === 404) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async rateUser(targetId: string, rating: number) {
    if (rating < 0 || rating > 5) {
      throw new ForbiddenException('Rating should be between 0 and 5');
    }
    const user = await prisma.users.findUnique({
      where: { id: targetId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await prisma.users.update({
      where: { id: targetId },
      data: {
        rating:
          (user.rating * user.numberOfRatings + rating) /
          (user.numberOfRatings + 1),
        numberOfRatings: user.numberOfRatings + 1,
      },
    });

    return {
      message: 'User fetched successfully',
      success: true,
      updatedUser,
    };
  }
}