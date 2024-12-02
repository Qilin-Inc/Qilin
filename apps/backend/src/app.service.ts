import { Injectable } from '@nestjs/common';
import { prisma } from './helpers/prisma';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  findAllUsers() {
    return prisma.users.findMany();
  }
}
