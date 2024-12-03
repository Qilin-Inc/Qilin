import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { BanUserDto, ConnectUserDto, CreateUserDto } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    console.log('[Nest] POST /users/signup');
    return this.usersService.createUser(body);
  }

  @Post('/connect')
  async connectUser(@Body() body: ConnectUserDto) {
    console.log('[Nest] PSOT /users/connect');
    return this.usersService.connectUser(body);
  }

  @Get()
  async getAllUsers() {
    console.log('[Nest] GET /users');
    return await this.usersService.getAllUsers();
  }

  @Get('/valorant/:userId')
  async getValoDetails(@Param('userId') userId: string) {
    console.log('[Nest] GET /valorant/:userId');
    return await this.usersService.getValoDetails(userId);
  }

  @Post('/ban/:id')
  async banUser(@Param('id') id: string, @Body() body: BanUserDto) {
    console.log('[Nest] POST /users/ban/' + id);
    return this.usersService.banUser(id, body.adminId);
  }

  @Get('/matchmaking/:userId')
  async getMatchmadeUser(@Param('userId') userId: string) {
    console.log('[Nest] GET /matchmaking/' + userId);
    return await this.usersService.matchmakeValorant(userId);
  }
}
