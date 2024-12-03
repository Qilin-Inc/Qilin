import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { prisma } from 'src/helpers/prisma';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTournamentDto } from './tournament.dto';

@Injectable()
export class TournamentService {
  async makeTournamentAdmin(id: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = await prisma.users.update({
        where: { id },
        data: {
          role: 'MANAGER',
        },
      });

      return {
        message: 'User made tournament manager successfully',
        success: true,
        user: updatedUser,
      };
    } catch (error: any) {
      if (error.status === 404) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getTournamentManagers() {
    try {
      const managers = await prisma.users.findMany({
        where: { role: 'MANAGER' },
      });

      if (!managers) {
        throw new NotFoundException('No managers found');
      }

      return {
        message: 'Managers fetched successfully',
        success: true,
        managers,
      };
    } catch (error: any) {
      if (error.status === 404) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllTournaments() {
    try {
      const tournaments = await prisma.tournament.findMany();
      return {
        message: 'Tournaments fetched successfully',
        success: true,
        tournaments,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createTournament(body: CreateTournamentDto) {
    try {
      const user = await prisma.users.findUnique({
        where: { id: body.ownerId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.role !== 'MANAGER') {
        throw new UnauthorizedException(
          'User is not authorized to create a tournament',
        );
      }

      const tournament = await prisma.tournament.create({
        data: {
          ownerId: body.ownerId,
          name: body.name,
          game: body.game,
          startDate: body.startDate,
          endDate: body.endDate,
          status: body.status,
          playerIds: body.playerIds,
        },
      });

      return {
        message: 'Tournament created successfully',
        success: true,
        tournament,
      };
    } catch (error: any) {
      if (error.status === 404) {
        throw new NotFoundException(error.message);
      } else if (error.status === 401) {
        throw new UnauthorizedException(error.message);
      } else throw new InternalServerErrorException(error.message);
    }
  }

  async updateTournament(id: string, body: any) {
    try {
      const tournament = await prisma.tournament.findUnique({
        where: { id },
      });

      if (!tournament) {
        throw new NotFoundException('Tournament not found');
      }

      const updatedTournament = await prisma.tournament.update({
        where: { id },
        data: body,
      });

      return {
        message: 'Tournament updated successfully',
        success: true,
        tournament: updatedTournament,
      };
    } catch (error: any) {
      if (error.status === 404) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async joinTournament(id: string, body: any) {
    try {
      const tournament = await prisma.tournament.findUnique({
        where: { id },
      });

      const user = await prisma.users.update({
        where: { id: body.userId },
        data: {
          TournamentsJoinedIds: {
            push: id,
          },
        },
      });

      if (!tournament) {
        throw new NotFoundException('Tournament not found');
      }

      if (tournament.playerIds.includes(body.userId)) {
        throw new UnauthorizedException('User already joined the tournament');
      }

      if (tournament.status === 'CLOSED') {
        throw new ForbiddenException('Tournament is closed');
      }

      const updatedTournament = await prisma.tournament.update({
        where: { id },
        data: {
          playerIds: {
            push: body.userId,
          },
        },
      });

      return {
        message: 'User joined tournament successfully',
        success: true,
        tournament: updatedTournament,
      };
    } catch (error: any) {
      if (error.status === 404) {
        throw new NotFoundException(error.message);
      }
      if (error.status === 401) {
        throw new UnauthorizedException(error.message);
      } else if (error.status === 403) {
        throw new ForbiddenException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getTournamentStatus(id: string) {
    try {
      const tournament = await prisma.tournament.findUnique({
        where: { id },
      });

      if (!tournament) {
        throw new NotFoundException('Tournament not found');
      }

      return {
        message: 'Tournament status fetched successfully',
        success: true,
        status: tournament.status,
      };
    } catch (error: any) {
      if (error.status === 404) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async toggleTournamentStatus(id: string, body: any) {
    try {
      const tournament = await prisma.tournament.findUnique({
        where: { id },
      });

      if (!tournament) {
        throw new NotFoundException('Tournament not found');
      }

      if (tournament.ownerId !== body.userId) {
        throw new UnauthorizedException(
          'User is not authorized to toggle tournament status',
        );
      }

      const updatedTournament = await prisma.tournament.update({
        where: { id },
        data: {
          status: tournament.status === 'OPEN' ? 'CLOSED' : 'OPEN',
        },
      });

      return {
        message: 'Tournament status toggled successfully',
        success: true,
        status: updatedTournament.status,
      };
    } catch (error: any) {
      if (error.status === 404) {
        throw new NotFoundException(error.message);
      } else if (error.status === 401) {
        throw new UnauthorizedException(error.message);
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async getTournamentById(id: string) {
    try {
      const tournament = await prisma.tournament.findUnique({
        where: { id },
      });

      if (!tournament) {
        throw new NotFoundException('Tournament not found');
      }

      return {
        message: 'Tournament fetched successfully',
        success: true,
        tournament,
      };
    } catch (error: any) {
      if (error.status === 404) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
