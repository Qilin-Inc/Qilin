import { Injectable } from '@nestjs/common';
import { prisma } from '../utils/prisma';
@Injectable()
export class DashboardService {
    async getDashboard(userId) {
        const user = await prisma.users.findUnique({
            where: {
                id: userId
            }
        });

        return {user: user, };
    }
}
