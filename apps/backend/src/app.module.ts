import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketService } from './services/socket';
import { VerifyemailController } from './verifyemail/verifyemail.controller';
import { VerifyemailService } from './verifyemail/verifyemail.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';


@Module({
  imports: [],
  controllers: [AppController, VerifyemailController, UsersController],
  providers: [AppService, SocketService, VerifyemailService, UsersService],
})
export class AppModule {}
