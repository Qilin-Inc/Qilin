jest.mock('src/helpers/prisma', () => ({
  prisma: {
    users: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    valorantUser: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    card: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
  },
}));

jest.mock('src/helpers/mailer', () => ({
  sendEmail: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { prisma } from 'src/helpers/prisma';
import axios from 'axios';
import { sendEmail } from 'src/helpers/mailer';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    id: 'user1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    verifyToken: '',
    verifyTokenExpiry: new Date(),
    role: 'USER',
    isBanned: false,
    rating: 0,
    numberOfRatings: 0,
  };

  const mockValorantUser = {
    id: 'valorant1',
    userId: 'user1',
    username: 'testuser',
    tag: '1234',
    puuid: 'puuid123',
    region: 'ap',
    accountLevel: 10,
    rank: 'Gold',
    mmr: 1500,
    cardId: 'card1',
  };

  const mockCard = {
    id: 'card1',
    small: 'https://media.valorant-api.com/playercards/card1/smallart.png',
    large: 'https://media.valorant-api.com/playercards/card1/largeart.png',
    wide: 'https://media.valorant-api.com/playercards/card1/wideart.png',
  };

  const mockCreateUserDto = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };

  const mockConnectUserDto = {
    userId: 'user1',
    username: 'testuser',
    tag: '1234',
  };

  const mockBanUserDto = {
    adminId: 'admin1',
  };

  const mockRateUserDto = {
    userId: 'user1',
    rating: 4,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully and send verification email', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.users.create as jest.Mock).mockResolvedValue(mockUser);
      (sendEmail as jest.Mock).mockResolvedValue(undefined);

      const result = await service.createUser(mockCreateUserDto);

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { email: mockCreateUserDto.email },
      });
      expect(prisma.users.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          username: mockCreateUserDto.username,
          email: mockCreateUserDto.email,
          password: expect.any(String),
          verifyToken: '',
          verifyTokenExpiry: expect.any(Date),
        }),
      });
      expect(sendEmail).toHaveBeenCalledWith({
        email: mockCreateUserDto.email,
        emailType: 'VERIFY',
        userId: mockUser.id,
      });
      expect(result).toEqual({
        message: 'User created successfully',
        success: true,
        savedUser: mockUser,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.users.create).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      (prisma.users.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('connectUser', () => {
    it('should connect a Valorant account successfully', async () => {
      (prisma.valorantUser.findUnique as jest.Mock).mockResolvedValue(null);
      (axios.get as jest.Mock)
        .mockResolvedValueOnce({
          data: {
            status: 200,
            data: {
              puuid: 'puuid123',
              region: 'ap',
              account_level: 10,
              card: 'card1',
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: {
              current: {
                tier: { name: 'Gold' },
                elo: 1500,
              },
            },
          },
        });
      (prisma.card.create as jest.Mock).mockResolvedValue(mockCard);
      (prisma.valorantUser.create as jest.Mock).mockResolvedValue(mockValorantUser);

      const result = await service.connectUser(mockConnectUserDto);

      expect(prisma.valorantUser.findUnique).toHaveBeenCalledWith({
        where: { userId: mockConnectUserDto.userId },
      });
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(prisma.card.create).toHaveBeenCalledWith({
        data: {
          small: `https://media.valorant-api.com/playercards/card1/smallart.png`,
          large: `https://media.valorant-api.com/playercards/card1/largeart.png`,
          wide: `https://media.valorant-api.com/playercards/card1/wideart.png`,
        },
      });
      expect(prisma.valorantUser.create).toHaveBeenCalledWith({
        data: {
          username: mockConnectUserDto.username,
          tag: mockConnectUserDto.tag,
          puuid: 'puuid123',
          region: 'ap',
          accountLevel: 10,
          rank: 'Gold',
          cardId: mockCard.id,
          mmr: 1500,
          userId: mockConnectUserDto.userId,
        },
      });
      expect(result).toEqual({
        message: 'Valorant account connected successfully',
        success: true,
        accountData: mockValorantUser,
      });
    });

    it('should throw ConflictException if Valorant account already connected', async () => {
      (prisma.valorantUser.findUnique as jest.Mock).mockResolvedValue(mockValorantUser);

      await expect(service.connectUser(mockConnectUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException if Valorant API fails', async () => {
      (prisma.valorantUser.findUnique as jest.Mock).mockResolvedValue(null);
      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: { status: 400 },
      });

      await expect(service.connectUser(mockConnectUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      (prisma.users.findMany as jest.Mock).mockResolvedValue([mockUser]);

      const result = await service.getAllUsers();

      expect(result).toEqual({
        message: 'Users fetched successfully',
        success: true,
        users: [mockUser],
      });
    });

    it('should throw InternalServerErrorException on database error', async () => {
      (prisma.users.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.getAllUsers()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // describe('banUser', () => {
  //   it('should ban a user successfully if admin', async () => {
  //     const admin = { id: 'admin1', role: 'ADMIN' };
  //     const updatedUser = { ...mockUser, isBanned: true };
  //     (prisma.users.findUnique as jest.Mock).mockResolvedValue(admin);
  //     (prisma.users.update as jest.Mock).mockResolvedValue(updatedUser);

  //     const result = await service.banUser(mockUser.id);

  //     expect(result).toEqual({
  //       message: 'User banned successfully',
  //       success: true,
  //       user: updatedUser,
  //     });
  //   });

  //   it('should throw UnauthorizedException if not admin', async () => {
  //     const nonAdmin = { id: 'user1', role: 'USER' };
  //     (prisma.users.findUnique as jest.Mock).mockResolvedValue(nonAdmin);

  //     await expect(service.banUser(mockUser.id)).rejects.toThrow(
  //       UnauthorizedException,
  //     );
  //   });

  //   it('should throw NotFoundException if user not found', async () => {
  //     const admin = { id: 'admin1', role: 'ADMIN' };
  //     (prisma.users.findUnique as jest.Mock).mockResolvedValue(admin);
  //     (prisma.users.update as jest.Mock).mockResolvedValue(null);

  //     await expect(service.banUser(mockUser.id, admin.id)).rejects.toThrow(
  //       NotFoundException,
  //     );
  //   });
  // });

  describe('getValoDetails', () => {
    it('should fetch Valorant user details successfully', async () => {
      (prisma.valorantUser.findUnique as jest.Mock).mockResolvedValue(mockValorantUser);
      (prisma.card.findUnique as jest.Mock).mockResolvedValue(mockCard);

      const result = await service.getValoDetails(mockValorantUser.userId);

      expect(result).toEqual({
        message: 'Valorant users fetched successfully',
        success: true,
        final: {
          ...mockValorantUser,
          card: mockCard,
          cardId: undefined,
        },
      });
    });

    it('should throw NotFoundException if Valorant user not found', async () => {
      (prisma.valorantUser.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getValoDetails(mockValorantUser.userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('rateUser', () => {
    it('should rate a user successfully', async () => {
      const updatedUser = { ...mockUser, rating: 4, numberOfRatings: 1 };
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.users.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.rateUser(mockRateUserDto.userId, mockRateUserDto.rating);

      expect(result).toEqual({
        message: 'User fetched successfully',
        success: true,
        updatedUser,
      });
    });

    it('should throw ForbiddenException if rating is out of range', async () => {
      await expect(service.rateUser(mockRateUserDto.userId, 6)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.rateUser(mockRateUserDto.userId, -1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.rateUser(mockRateUserDto.userId, mockRateUserDto.rating)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
