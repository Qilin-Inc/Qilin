import { Injectable } from '@nestjs/common';
import { prisma } from 'src/helpers/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
  // Create a new report
  async createReport(data: Prisma.ReportsCreateInput) {
    return prisma.reports.create({
      data,
    });
  }

  // Get all reports
  async getReports() {
    return prisma.reports.findMany();
  }
}
