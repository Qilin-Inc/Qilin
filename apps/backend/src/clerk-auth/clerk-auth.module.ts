import { Module } from '@nestjs/common';
import { ClerkAuthService } from './clerk-auth.service';
import { ClerkAuthController } from './clerk-auth.controller';
import { config } from 'process';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ConfigModule.forRoot()],
  controllers: [ClerkAuthController],
  providers: [ClerkAuthService],
})
export class ClerkAuthModule {}
