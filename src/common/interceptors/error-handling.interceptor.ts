import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';
// import { Observable } from 'rxjs';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    // console.log('ErrorHandlingInterceptor executed. BEFORE!');

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    return next.handle().pipe(
      catchError((error) => {
        // console.log('Error!');
        return throwError(() => {
          if (error.name === 'NotFoundException') {
            return new BadRequestException(error.message);
          }

          return new BadRequestException('Ocorreu um erro desconhecido!');
        });
      }),
    );
  }
}
