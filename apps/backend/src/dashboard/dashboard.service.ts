import { Injectable } from '@nestjs/common';
import { prisma } from '../helpers/prisma';
@Injectable()
export class DashboardService {
  async getDashboard(userId) {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    return { user: user };
  }
}
