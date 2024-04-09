import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseError extends HttpException {
  constructor(option: {
    error?: any;
    status?: number;
    message?: string;
    name?: string;
    subCode?: number;
    args?: Record<string, any>;
  }) {
    super(
      {
        error: option.error,
        message: option.message,
        args: option.args,
        subCode: option.subCode,
      },
      option.status || HttpStatus.BAD_REQUEST,
    );
    this.name = option.name;
  }

  public subCode: number;
}
