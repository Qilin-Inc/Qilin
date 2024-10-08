import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketService } from './services/socket';
import { VerifyemailController } from './verifyemail/verifyemail.controller';
import { VerifyemailService } from './verifyemail/verifyemail.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, VerifyemailController, UsersController, DashboardController],
  providers: [AppService, SocketService, VerifyemailService, UsersService, DashboardService],

})
export class AppModule {}
