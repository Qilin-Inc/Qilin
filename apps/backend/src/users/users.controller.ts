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
    return this.usersService.connectUser(body);
  }

  @Get()
  async getAllUsers() {
    console.log('[Nest] GET /users');
    return this.usersService.getAllUsers();
  }

  @Post('/ban/:id')
  async banUser(@Param('id') id: string) {
    return this.usersService.banUser(id);
  }
}
