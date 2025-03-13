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
import { SocketService } from './services/socket';
import {  MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { Logger } from './middlewares/logger.service';

@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggingModule {}

@Module({
  imports: [LoggingModule, UsersModule, ConfigModule.forRoot({ isGlobal: true }), TournamentModule, ReportsModule],
  controllers: [
    AppController,
    VerifyemailController,
    UsersController,
    DashboardController,
  ],
  providers: [AppService, VerifyemailService, UsersService, DashboardService, SocketService]
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
