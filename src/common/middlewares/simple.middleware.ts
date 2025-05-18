import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('SimpleMiddleware: Hello!');
    const authorization = req.headers.authorization;

    if (authorization) {
      req['user'] = {
        name: 'Gabriel',
        lastname: 'Fernandes',
        role: 'admin',
      };
    }

    res.setHeader('CABECALHO', 'DO Middleware');

    next(); //Goes to the next middleware

    // console.log('SimpleMiddleware: tchau!');

    // res.on('finish', () => {
    //   console.log('SimpleMiddleware: terminou!');
    // });
  }
}
