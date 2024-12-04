import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // POST: Create a new report
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

  // GET: Fetch all reports
  @Get()
  async getReports() {
    return this.reportsService.getReports();
  }
}
