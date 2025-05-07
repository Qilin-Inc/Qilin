import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  name: string;
  stats: string;
  winrate: string;
  kda: string;
  rank: string;
}

export class ConnectUserDto {
  userId: string;
  username: string;
  tag: string;
}

export class RateUserDto {
  userId: string;
  rating: number;
}
