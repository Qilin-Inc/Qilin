import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketService } from './services/socket';;
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { ConfigModule } from '@nestjs/config';
import { ClerkAuthModule } from './clerk-auth/clerk-auth.module';
import { ClerkAuthController } from './clerk-auth/clerk-auth.controller';
import { ClerkAuthService } from './clerk-auth/clerk-auth.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ClerkAuthModule],
  controllers: [AppController, UsersController, DashboardController,ClerkAuthController],
  providers: [AppService, SocketService, UsersService, DashboardService,ClerkAuthService],

})
export class AppModule {}
