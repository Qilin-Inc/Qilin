import { Injectable } from '@nestjs/common';
import { prisma } from './utils/primsa';


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  findAllUsers() {
    return prisma.users.findMany();
  }
}
