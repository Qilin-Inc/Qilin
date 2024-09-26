import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Post("/signup")
    async createUser(@Body() body: any){
        console.log("controller called", body);
        return this.usersService.createUser(body);
    }
}
