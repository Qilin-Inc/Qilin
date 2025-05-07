import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get("/user/:userId")
    async getDashboard(@Param("userId") userId: string) {
        return this.dashboardService.getDashboard(userId);
    }

    @Get("/info")
    async getInfo() {
        return this.dashboardService.getInfo();
    }

    @Get("/users")
    async getUsers() {
        return this.dashboardService.getUsers();
    }
}
