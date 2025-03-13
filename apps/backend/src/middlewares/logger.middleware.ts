import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';
import { Logger } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    morgan('combined', {
      stream: this.logger.getStream(),
    })(req, res, next);
  }
}
