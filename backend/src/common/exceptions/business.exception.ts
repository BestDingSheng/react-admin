import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(response: { code: number; message: string }) {
    super(response, HttpStatus.OK); // 使用 200 状态码
  }
} 