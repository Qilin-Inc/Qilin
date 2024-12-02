import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ConnectUserDto, CreateUserDto } from './user.dto';

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

  @Post('/ban/:id')
  async banUser(@Param('id') id: string) {
    console.log('[Nest] POST /users/ban/' + id);
    return this.usersService.banUser(id);
  }

  @Get('/matchmaking/:id')
  async getMatchmadeUser(@Param('id') id: string) {
    console.log('[Nest] GET /matchmaking/' + id);
    return await this.usersService.matchmakeValorant(id);
  }
}
