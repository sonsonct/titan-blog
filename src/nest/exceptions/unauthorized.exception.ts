import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.exception';
export class UnauthorizedError extends BaseError {
  constructor(option: { error?: any; message?: string; name?: string; subCode?: number }) {
    super({
      error: option.error,
      message: option.message,
      status: HttpStatus.UNAUTHORIZED,
      subCode: option.subCode,
      name: option.name,
    });
  }
}
