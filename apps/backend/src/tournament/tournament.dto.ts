export class CreateTournamentDto {
  ownerId: string;
  name: string;
  game: string;
  startDate: Date;
  endDate: Date;
  status: 'OPEN' | 'CLOSED';
  playerIds: string[];
}

export class JoinTournamentDto {
  playerId: string;
}

export class ToggleTournamentStatusDto {
  userId: string;
  status?: 'OPEN' | 'CLOSED';
}
