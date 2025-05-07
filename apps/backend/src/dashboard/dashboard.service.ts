import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { prisma } from '../helpers/prisma';
@Injectable()
export class DashboardService {
  async getDashboard(userId) {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    return { user: user };
  }

  async getInfo() {
    try {
      const users = await prisma.users.count();
      const bannedUsersCount = await prisma.users.count({
        where: {
          isBanned: true,
        },
      });
      const tournaments = await prisma.tournament.findMany({
        include: {
          players: true,
        },
      });
      const totalParticipants = tournaments.reduce((sum, tournament) => {
        return sum + tournament.players.length;
      }, 0);
      const averageParticipants =
        tournaments.length > 0
          ? (totalParticipants / tournaments.length).toFixed(2)
          : 0;

      return {
        users,
        banned: bannedUsersCount,
        tournaments: tournaments.length,
        footfall: averageParticipants
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUsers() {
    try {
      const users = await prisma.users.findMany();
      const output = await Promise.all(users.map(async (user) => {
        const valorant = await prisma.valorantUser.findFirst({ where: { userId: user.id } });
        if (valorant) {
          return {
            ...user,
            valorant
          }
        } else {
          return {
            ...user,
            valorant: {
              id: "",
              userId: "",
              rank: "",
              tag: "",
              region: "",
              isBanned: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          }
        }
      })
      );
      return {
        message: 'Users fetched successfully',
        success: true,
        users: output,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
