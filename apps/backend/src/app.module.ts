import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketService } from './services/socket';
import { userModule } from './users/user.module';

@Module({
  imports: [userModule],
  controllers: [AppController],
  providers: [AppService, SocketService],
})
export class AppModule {}
