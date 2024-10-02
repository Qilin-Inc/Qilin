import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Post("/signup")
    async createUser(@Body() body: any){
        console.log("controller called", body);
        return this.usersService.createUser(body);
    }

    @Post("/connect")
    async connectUser(@Body() body: any){
        return this.usersService.connectUser(body);
    }

    @Get()
    async getAllUsers(){
        return this.usersService.getAllUsers();
    }

    @Post("/ban/:id")
    async banUser(@Param("id") id: string){
        return this.usersService.banUser(id);
    }

    @Get("/getPUUID/:id")
    async getPUUID(@Param("id") id: string){
        return this.usersService.getPUUID(id);
    }

    @Get("/val/:puuid")
    async getFiveValMatches(@Param("puuid") puuid: string){
        return this.usersService.getFiveValMatches(puuid);
    }
}
