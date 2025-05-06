import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async createReport(
    @Body()
    data: {
      username: string;
      reporteduser: string;
      description: string;
    },
  ) {
    return this.reportsService.createReport(data);
  }

  @Get()
  async getReports() {
    return this.reportsService.getReports();
  }
}
