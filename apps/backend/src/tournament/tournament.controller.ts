import { Body, Controller, Get, Param, Patch, Post,Delete } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto, JoinTournamentDto } from './tournament.dto';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post('/makemanager/:id')
  async makeTournamentAdmin(@Param() { id }: { id: string }) {
    console.log('[Nest] POST /tournament/makemanager/' + id);
    return this.tournamentService.makeTournamentAdmin(id);
  }

  @Post('/create')
  async createTournament(@Body() body: CreateTournamentDto) {
    console.log('[Nest] POST /tournament/create');
    return this.tournamentService.createTournament(body);
  }

  @Post('/join/:id')
  async joinTournament(
    @Param() { id }: { id: string },
    @Body() body: JoinTournamentDto,
  ) {
    console.log('[Nest] POST /tournament/join/' + id);
    return this.tournamentService.joinTournament(id, body);
  }

  @Post('/status/toggle/:id')
  async toggleTournamentStatus(@Param('id') id: string, @Body() body: any) {
    console.log('[Nest] POST /tournament/status/toggle/' + id);
    return this.tournamentService.toggleTournamentStatus(id, body);
  }

  @Patch('/update/:id')
  async updateTournament(
    @Param() { id }: { id: string },
    @Body() body: CreateTournamentDto,
  ) {
    console.log('[Nest] PATCH /tournament/update/' + id);
    return this.tournamentService.updateTournament(id, body);
  }

  @Get('/managers')
  async getTournamentManagers() {
    console.log('[Nest] GET /tournament/managers');
    return this.tournamentService.getTournamentManagers();
  }

  @Get()
  async getAllTournaments() {
    console.log('[Nest] GET /tournament');
    return await this.tournamentService.getAllTournaments();
  }

  @Get('/status/:id')
  async getTournamentStatus(@Param() { id }: { id: string }) {
    console.log('[Nest] GET /tournament/status/' + id);
    return this.tournamentService.getTournamentStatus(id);
  }

  @Get('/:id')
  async getTournament(@Param() { id }: { id: string }) {
    console.log('[Nest] GET /tournament/' + id);
    return this.tournamentService.getTournamentById(id);
  }

  @Delete('/delete/:id')
  async deleteTournament(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    console.log(`[Nest] DELETE /tournament/delete/${id}`);
    return this.tournamentService.deleteTournament(id, userId);
  }

  @Post('withdraw/:id')
async withdrawFromTournament(@Param('id') id: string, @Body() body: any) {
  return this.tournamentService.withdrawFromTournament(id, body);
}
}
