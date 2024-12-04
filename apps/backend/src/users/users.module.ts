import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ReportsModule } from './reports/reports.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [ReportsModule],
})
export class UsersModule {}
