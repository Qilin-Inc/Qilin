import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ConnectUserDto,
  CreateUserDto,
  RateUserDto,
} from './user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
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

  @Post('/rate')
  async rateUser(@Body() body: RateUserDto) {
    console.log('[Nest] POST /users/rate');
    return this.usersService.rateUser(body.userId, body.rating);
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
  async banUser(@Param('id') id: string) {
    console.log('[Nest] POST /users/ban/' + id);
    return this.usersService.banUser(id);
  }

  @Post('/delete/:id')
  async deleteUser(@Param('id') id: string) {
    console.log('[Nest] POST /users/delete/' + id);
    return this.usersService.deleteUser(id);
  }

  @Post('/promote/:id')
  async promoteUser(@Param('id') id: string) {
    console.log('[Nest] POST /users/promote/' + id);
    return this.usersService.promoteUser(id);
  }
  @Post('/demote/:id')
  async demoteUser(@Param('id') id: string) {
    console.log('[Nest] POST /users/demote/' + id);
    return this.usersService.demoteUser(id);
  }

  @Get('/matchmaking/:userId')
  async getMatchmadeUser(@Param('userId') userId: string) {
    console.log('[Nest] GET /matchmaking/' + userId);
    return await this.usersService.matchmakeValorant(userId);
  }
}
