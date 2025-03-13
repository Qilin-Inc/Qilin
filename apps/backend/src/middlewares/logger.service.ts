import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class Logger implements LoggerService {
  private logDir = 'logs';
  private logger: winston.Logger;

  constructor() {
    // Ensure the logs directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          filename: path.join(this.logDir, 'app-%DATE%.log'),
          datePattern: 'YYYY-MM-DD-mm',
          maxFiles: '14d', // Keep logs for 14 days
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  getStream() {
    return {
      write: (message: string) => this.logger.info(message.trim()),
    };
  }
}
