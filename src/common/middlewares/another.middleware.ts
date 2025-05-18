import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class AnotherMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('AnotherMiddleware: Hello!');
    const authorization = req.headers.authorization;

    if (authorization) {
      req['user'] = {
        name: 'Gabriel',
        lastname: 'Fernandes',
      };
    }

    res.setHeader('CABECALHO', 'DO Middleware');

    next();

    // console.log('AnotherMiddleware: tchau!');
  }
}
