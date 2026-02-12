import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error', statusCode: 500 };

    const errorLog = {
      timestamp: new Date().toISOString(),
      level: status >= 500 ? 'error' : 'warn',
      message: exception instanceof Error ? exception.message : 'Error desconocido',
      path: request.url,
      method: request.method,
      ip: request.ip,
      statusCode: status,
      stack: exception instanceof Error ? exception.stack : null,
    };

    if (status >= 500) {
      this.logger.error('Error critico de servidor', errorLog);
    } else {
      this.logger.warn('Error Controlado (Ciente)', errorLog);
    }

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
