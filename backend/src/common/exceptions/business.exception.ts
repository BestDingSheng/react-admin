import { HttpException, HttpStatus } from '@nestjs/common';

interface BusinessError {
  code: number;
  message: string;
}

export class BusinessException extends HttpException {
  private readonly code: number;

  constructor(error: BusinessError) {
    super(error.message, HttpStatus.OK);
    this.code = error.code;
  }

  getCode(): number {
    return this.code;
  }

  getMessage(): string {
    return this.message;
  }
}
