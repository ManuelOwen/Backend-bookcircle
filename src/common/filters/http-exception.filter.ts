import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let validationErrors: any = null;

    // Handle class-validator validation errors
    if (exception instanceof Error && exception.message) {
      try {
        // Check if the error is a validation error from class-validator
        const parsedError = JSON.parse(exception.message);
        if (Array.isArray(parsedError)) {
          status = HttpStatus.UNPROCESSABLE_ENTITY; // 422
          message = 'Validation failed';
          validationErrors = parsedError;
        }
      } catch (e) {
        // Not a JSON string, use the message as is
        message = exception.message;
      }
    }

    // Handle HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      
      if (typeof response === 'object') {
        message = (response as any).message || message;
        if ((response as any).error) {
          message = (response as any).error;
        }
      } else if (typeof response === 'string') {
        message = response;
      }
    }

    // Log the error
    console.error(`[${request.method}] ${request.url}`, {
      status,
      message,
      validationErrors,
      timestamp: new Date().toISOString(),
      path: request.url,
      stack: process.env.NODE_ENV === 'development' ? exception.stack : undefined,
    });

    // Send response
    response.status(status).json({
      statusCode: status,
      message,
      ...(validationErrors && { errors: validationErrors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
