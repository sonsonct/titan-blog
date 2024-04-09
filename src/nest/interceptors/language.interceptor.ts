import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable, UseInterceptors } from '@nestjs/common';
import type { Observable } from 'rxjs';

import { ContextProvider } from '../common/provider/context.provider';
import { LanguageCode } from '../common/const/language-code';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<undefined> {
    const request = context.switchToHttp().getRequest();
    const language: string = request.headers['x-custom-lang'];

    if (LanguageCode[language]) {
      ContextProvider.setLanguage(language);
    }

    return next.handle();
  }
}

export function UseLanguageInterceptor() {
  return UseInterceptors(LanguageInterceptor);
}
