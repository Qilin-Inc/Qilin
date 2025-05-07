jest.mock('src/helpers/prisma', () => ({
  prisma: {
    users: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    tournament: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { TournamentService } from './tournament.service';
import { NotFoundException, UnauthorizedException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { CreateTournamentDto, ToggleTournamentStatusDto } from './tournament.dto';
import { prisma } from 'src/helpers/prisma';

describe('TournamentService', () => {
  let service: TournamentService;

  // Mock data
  const mockUser = {
    id: 'user1',
    email: 'user1@example.com',
    name: 'Test User',
    role: 'USER',
    TournamentsJoinedIds: [],
  };

  const mockManagerUser = {
    id: 'manager1',
    email: 'manager1@example.com',
    name: 'Test Manager',
    role: 'MANAGER',
    TournamentsJoinedIds: [],
  };

  const mockAdminUser = {
    id: 'admin1',
    email: 'admin1@example.com',
    name: 'Test Admin',
    role: 'ADMIN',
    TournamentsJoinedIds: [],
  };

  const mockTournament = {
    id: 'tournament1',
    name: 'Test Tournament',
    game: 'Chess',
    startDate: new Date(),
    endDate: new Date(),
    status: 'OPEN',
    playerIds: [],
    ownerId: 'manager1',
  };

  const mockCreateTournamentDto: CreateTournamentDto = {
    name: 'New Tournament',
    game: 'Chess',
    startDate: new Date(),
    endDate: new Date(),
    status: 'OPEN',
    playerIds: [],
    ownerId: 'manager1',
  };

  const mockToggleStatusDto: ToggleTournamentStatusDto = {
    userId: 'manager1',
  };

  const mockWithdrawTournamentDto = {
    userId: 'user1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentService],
    }).compile();

    service = module.get<TournamentService>(TournamentService);
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('makeTournamentAdmin', () => {
    it('should make a user a tournament manager', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.users.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        role: 'MANAGER',
      });

      const result = await service.makeTournamentAdmin('user1');

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: 'user1' },
      });
      expect(prisma.users.update).toHaveBeenCalledWith({
        where: { id: 'user1' },
        data: { role: 'MANAGER' },
      });
      expect(result.success).toBe(true);
      expect(result.user.role).toBe('MANAGER');
    });

    it('should throw NotFoundException if user not found', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.makeTournamentAdmin('nonexistent')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should handle internal server errors', async () => {
      (prisma.users.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.makeTournamentAdmin('user1')).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('getTournamentManagers', () => {
    it('should return all tournament managers', async () => {
      (prisma.users.findMany as jest.Mock).mockResolvedValue([mockManagerUser]);

      const result = await service.getTournamentManagers();

      expect(prisma.users.findMany).toHaveBeenCalledWith({
        where: { role: 'MANAGER' },
      });
      expect(result.success).toBe(true);
      expect(result.managers).toEqual([mockManagerUser]);
    });

    it('should throw NotFoundException if no managers found', async () => {
      (prisma.users.findMany as jest.Mock).mockResolvedValue(null);

      await expect(service.getTournamentManagers()).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getAllTournaments', () => {
    it('should return all tournaments', async () => {
      (prisma.tournament.findMany as jest.Mock).mockResolvedValue([mockTournament]);

      const result = await service.getAllTournaments();

      expect(prisma.tournament.findMany).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.tournaments).toEqual([mockTournament]);
    });

    it('should handle internal server errors', async () => {
      (prisma.tournament.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.getAllTournaments()).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('createTournament', () => {
    it('should create a tournament when user is a manager', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockManagerUser);
      (prisma.tournament.create as jest.Mock).mockResolvedValue({
        ...mockCreateTournamentDto,
        id: 'new-tournament',
      });

      const result = await service.createTournament(mockCreateTournamentDto);

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: mockCreateTournamentDto.ownerId },
      });
      expect(prisma.tournament.create).toHaveBeenCalledWith({
        data: mockCreateTournamentDto,
      });
      expect(result.success).toBe(true);
      expect(result.tournament).toHaveProperty('id', 'new-tournament');
    });

    it('should create a tournament when user is an admin', async () => {
      const adminTournamentDto = { ...mockCreateTournamentDto, ownerId: 'admin1' };
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);
      (prisma.tournament.create as jest.Mock).mockResolvedValue({
        ...adminTournamentDto,
        id: 'new-tournament',
      });

      const result = await service.createTournament(adminTournamentDto);

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: 'admin1' },
      });
      expect(prisma.tournament.create).toHaveBeenCalledWith({
        data: adminTournamentDto,
      });
      expect(result.success).toBe(true);
      expect(result.tournament).toHaveProperty('id', 'new-tournament');
    });

    it('should throw UnauthorizedException if user is not a manager or admin', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.createTournament(mockCreateTournamentDto)).rejects.toThrow(
        UnauthorizedException
      );
      expect(prisma.tournament.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.createTournament(mockCreateTournamentDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateTournament', () => {
    it('should update tournament details', async () => {
      const updateData = { name: 'Updated Tournament' };
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(mockTournament);
      (prisma.tournament.update as jest.Mock).mockResolvedValue({
        ...mockTournament,
        ...updateData,
      });

      const result = await service.updateTournament('tournament1', updateData);

      expect(prisma.tournament.findUnique).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
      });
      expect(prisma.tournament.update).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
        data: updateData,
      });
      expect(result.success).toBe(true);
      expect(result.tournament.name).toBe('Updated Tournament');
    });

    it('should throw NotFoundException if tournament not found', async () => {
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateTournament('nonexistent', {})).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('withdrawFromTournament', () => {
    it('should allow a user to withdraw from a tournament', async () => {
      const tournamentWithUser = {
        ...mockTournament,
        playerIds: ['user1'],
        status: 'OPEN',
      };
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(tournamentWithUser);
      (prisma.users.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        TournamentsJoinedIds: ['tournament1'],
      });
      (prisma.users.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        TournamentsJoinedIds: [],
      });
      (prisma.tournament.update as jest.Mock).mockResolvedValue({
        ...tournamentWithUser,
        playerIds: [],
      });

      const result = await service.withdrawFromTournament('tournament1', mockWithdrawTournamentDto);

      expect(prisma.tournament.findUnique).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
      });
      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: 'user1' },
      });
      expect(prisma.users.update).toHaveBeenCalledWith({
        where: { id: 'user1' },
        data: {
          TournamentsJoinedIds: {
            set: [],
          },
        },
      });
      expect(prisma.tournament.update).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
        data: {
          playerIds: {
            set: [],
          },
        },
      });
      expect(result.success).toBe(true);
    });

    it('should throw NotFoundException if tournament not found', async () => {
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.withdrawFromTournament('nonexistent', mockWithdrawTournamentDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw UnauthorizedException if user has not joined', async () => {
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(mockTournament);

      await expect(service.withdrawFromTournament('tournament1', mockWithdrawTournamentDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw ForbiddenException if tournament is closed', async () => {
      const closedTournament = {
        ...mockTournament,
        status: 'CLOSED',
        playerIds: ['user1'],
      };
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(closedTournament);

      await expect(service.withdrawFromTournament('tournament1', mockWithdrawTournamentDto)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      const tournamentWithUser = {
        ...mockTournament,
        playerIds: ['user1'],
        status: 'OPEN',
      };
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(tournamentWithUser);
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.withdrawFromTournament('tournament1', mockWithdrawTournamentDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ForbiddenException if user is manager or admin', async () => {
      const tournamentWithUser = {
        ...mockTournament,
        playerIds: ['manager1'],
        status: 'OPEN',
      };
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(tournamentWithUser);
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockManagerUser);

      await expect(service.withdrawFromTournament('tournament1', { userId: 'manager1' })).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('getTournamentStatus', () => {
    it('should return tournament status', async () => {
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(mockTournament);

      const result = await service.getTournamentStatus('tournament1');

      expect(prisma.tournament.findUnique).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
      });
      expect(result.success).toBe(true);
      expect(result.status).toBe('OPEN');
    });

    it('should throw NotFoundException if tournament not found', async () => {
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getTournamentStatus('nonexistent')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('toggleTournamentStatus', () => {
    it('should toggle tournament status from OPEN to CLOSED for owner', async () => {
      const openTournament = {
        ...mockTournament,
        status: 'OPEN',
        ownerId: 'manager1',
      };
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(openTournament);
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockManagerUser);
      (prisma.tournament.update as jest.Mock).mockResolvedValue({
        ...openTournament,
        status: 'CLOSED',
      });

      const result = await service.toggleTournamentStatus('tournament1', mockToggleStatusDto);

      expect(prisma.tournament.findUnique).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
      });
      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: 'manager1' },
      });
      expect(prisma.tournament.update).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
        data: {
          status: 'CLOSED',
        },
      });
      expect(result.success).toBe(true);
      expect(result.status).toBe('CLOSED');
    });

    it('should toggle tournament status from CLOSED to OPEN for owner', async () => {
      const closedTournament = {
        ...mockTournament,
        status: 'CLOSED',
        ownerId: 'manager1',
      };
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(closedTournament);
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockManagerUser);
      (prisma.tournament.update as jest.Mock).mockResolvedValue({
        ...closedTournament,
        status: 'OPEN',
      });

      const result = await service.toggleTournamentStatus('tournament1', mockToggleStatusDto);

      expect(prisma.tournament.update).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
        data: {
          status: 'OPEN',
        },
      });
      expect(result.status).toBe('OPEN');
    });

    it('should toggle tournament status for admin (non-owner)', async () => {
      const openTournament = {
        ...mockTournament,
        status: 'OPEN',
        ownerId: 'differentUser',
      };
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(openTournament);
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);
      (prisma.tournament.update as jest.Mock).mockResolvedValue({
        ...openTournament,
        status: 'CLOSED',
      });

      const result = await service.toggleTournamentStatus('tournament1', { userId: 'admin1' });

      expect(prisma.tournament.findUnique).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
      });
      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: 'admin1' },
      });
      expect(prisma.tournament.update).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
        data: {
          status: 'CLOSED',
        },
      });
      expect(result.success).toBe(true);
      expect(result.status).toBe('CLOSED');
    });

    it('should throw UnauthorizedException if user is neither admin nor owner', async () => {
      const tournament = {
        ...mockTournament,
        ownerId: 'differentUser',
      };
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(tournament);
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.toggleTournamentStatus('tournament1', { userId: 'user1' })).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw NotFoundException if tournament not found', async () => {
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.toggleTournamentStatus('nonexistent', mockToggleStatusDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(mockTournament);
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.toggleTournamentStatus('tournament1', mockToggleStatusDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getTournamentById', () => {
    it('should return a tournament by id', async () => {
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(mockTournament);

      const result = await service.getTournamentById('tournament1');

      expect(prisma.tournament.findUnique).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
      });
      expect(result.success).toBe(true);
      expect(result.tournament).toEqual(mockTournament);
    });

    it('should throw NotFoundException if tournament not found', async () => {
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getTournamentById('nonexistent')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('deleteTournament', () => {
    it('should delete a tournament if user is a manager and owner', async () => {
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(mockTournament);
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockManagerUser);
      (prisma.tournament.delete as jest.Mock).mockResolvedValue({ id: 'tournament1' });

      const result = await service.deleteTournament('tournament1', 'manager1');

      expect(prisma.tournament.findUnique).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
      });
      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: 'manager1' },
      });
      expect(prisma.tournament.delete).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
      });
      expect(result.success).toBe(true);
    });

    it('should delete a tournament if user is an admin', async () => {
      const nonOwnedTournament = {
        ...mockTournament,
        ownerId: 'differentUser',
      };
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(nonOwnedTournament);
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);
      (prisma.tournament.delete as jest.Mock).mockResolvedValue({ id: 'tournament1' });

      const result = await service.deleteTournament('tournament1', 'admin1');

      expect(prisma.tournament.delete).toHaveBeenCalledWith({
        where: { id: 'tournament1' },
      });
      expect(result.success).toBe(true);
    });

    it('should throw UnauthorizedException if user is manager but not owner', async () => {
      const nonOwnedTournament = {
        ...mockTournament,
        ownerId: 'differentUser',
      };
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(nonOwnedTournament);
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockManagerUser);

      await expect(service.deleteTournament('tournament1', 'manager1')).rejects.toThrow(
        UnauthorizedException
      );
      expect(prisma.tournament.delete).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user is not manager or admin', async () => {
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(mockTournament);
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.deleteTournament('tournament1', 'user1')).rejects.toThrow(
        UnauthorizedException
      );
      expect(prisma.tournament.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if tournament not found', async () => {
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteTournament('nonexistent', 'manager1')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      (prisma.tournament.findUnique as jest.Mock).mockResolvedValue(mockTournament);
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteTournament('tournament1', 'nonexistent')).rejects.toThrow(
        NotFoundException
      );
    });
  });
});