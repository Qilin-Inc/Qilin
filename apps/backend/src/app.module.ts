import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerifyemailController } from './verifyemail/verifyemail.controller';
import { VerifyemailService } from './verifyemail/verifyemail.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TournamentModule } from './tournament/tournament.module';
import { ReportsModule } from './users/reports/reports.module';

@Module({
  imports: [UsersModule, ConfigModule.forRoot({ isGlobal: true }), TournamentModule, ReportsModule],
  controllers: [
    AppController,
    VerifyemailController,
    UsersController,
    DashboardController,
  ],
  providers: [AppService, VerifyemailService, UsersService, DashboardService],
})
export class AppModule {}
