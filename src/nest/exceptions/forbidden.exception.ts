import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.exception';
export class ForbiddenError extends BaseError {
  constructor(option: { error?: any; message?: string; name?: string }) {
    super({
      error: option.error,
      message: option.message,
      status: HttpStatus.FORBIDDEN,
      name: option.name,
    });
  }
}
