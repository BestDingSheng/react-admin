import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let responseBody = {
      code: 20000,
      message: '操作失败',
    };

    // 如果异常响应是对象，并且包含 code 和 message
    if (typeof exceptionResponse === 'object' && 'code' in exceptionResponse && 'message' in exceptionResponse) {
      responseBody = exceptionResponse as any;
    }
    // 如果异常响应只是一个消息字符串
    else if (typeof exceptionResponse === 'string') {
      responseBody.message = exceptionResponse;
    }
    // 如果异常响应是一个对象，但没有 code 和 message
    else if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      responseBody.message = (exceptionResponse as any).message;
    }

    response.status(status).json(responseBody);
  }
} 