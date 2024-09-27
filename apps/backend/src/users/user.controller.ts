import { Controller, Get, Post, Body } from '@nestjs/common';
import { userService } from './user.service';
import { CreateUserDto } from './user.dto';

@Controller('users')
export class userController {
  constructor(private readonly userService: userService) {}

  @Get()
  getusers() {
    return this.userService.getusers();
  }

  @Post()
  createuser(@Body() createuserDto: CreateUserDto) {
    return this.userService.createuser(createuserDto);
  }
}
