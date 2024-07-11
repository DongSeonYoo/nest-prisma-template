import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { ISuccessResponse } from 'src/interfaces/response.interface';

@Injectable()
export class SuccessResponseInterceptor<T>
  implements NestInterceptor<T, ISuccessResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ISuccessResponse<T>> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => ({
        statusCode: res.statusCode,
        message:
          this.reflector.get('response_message', context.getHandler()) || '',
        timestamp: new Date(),
        requestURL: req.path,
        data: data || {},
      })),
    );
  }
}
