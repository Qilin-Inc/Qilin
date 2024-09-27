import { Injectable } from '@nestjs/common';
import { prisma } from './utils/prisma';


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  findAllUsers() {
    return prisma.users.findMany();
  }
}
