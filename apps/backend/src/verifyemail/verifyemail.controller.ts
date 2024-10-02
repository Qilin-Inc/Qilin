import { Body, Controller, Post } from '@nestjs/common';
import { VerifyemailService } from './verifyemail.service';
import { prisma } from 'src/utils/prisma';

@Controller('verifyemail')
export class VerifyemailController {
constructor(private readonly verifyemailService: VerifyemailService) {}

    @Post()
    async verifyEmail(@Body() body: { token: string }){
        return this.verifyemailService.verifyEmail(body.token);
    }
}