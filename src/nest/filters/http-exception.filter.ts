import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    return response
      .status(exception.getStatus())
      .json(await this.getMessage(exception, ctx.getRequest().i18nLang));
  }

  async getMessage(exception: HttpException, lang: string) {
    const exceptionResponse = exception.getResponse() as {
      error: any;
      message: string | string[];
      args: Record<string, any>;
      subCode: number;
    };

    if (
      exceptionResponse.hasOwnProperty('error') &&
      exceptionResponse.error &&
      exceptionResponse.error instanceof Array
    ) {
      return {
        statusCode: exception.getStatus(),
        errorList: await this.translateArrayWithFieldName(exceptionResponse.error, lang),
      };
    }
    if (exceptionResponse.hasOwnProperty('message')) {
      if (exceptionResponse.message instanceof Array) {
        exceptionResponse.message = await this.translateArray(exceptionResponse.message, lang);
      } else if (typeof exceptionResponse.message === 'string') {
        exceptionResponse.message = await this.i18n.translate(exceptionResponse.message, {
          lang: lang,
          args: exceptionResponse.args,
        });
      }
      return {
        statusCode: exception.getStatus(),
        subCode: exceptionResponse.subCode,
        message: exceptionResponse.message || exceptionResponse,
      };
    }

    return {
      statusCode: exception.getStatus(),
      subCode: exceptionResponse.subCode,
      message: exceptionResponse,
    };
  }

  async translateArray(errors: any[], lang: string) {
    const data = [];
    for (let i = 0; i < errors.length; i++) {
      const item = errors[i];
      if (typeof item === 'string') {
        data.push(await this.i18n.translate(item, { lang: lang }));
        continue;
      } else if (item.hasOwnProperty('constraints')) {
        const message = await Promise.all(
          Object.values(item.constraints).map(
            async (value: string) => await this.i18n.translate(value, { lang: lang }),
          ),
        );
        data.push({ field: item.property, message: message });
        continue;
      }
      data.push(item);
    }
    return data;
  }

  async translateArrayWithFieldName(errors: any[], lang: string) {
    const data = [];
    for (let i = 0; i < errors.length; i++) {
      const item = errors[i];
      if (item.message && item.fieldName && typeof item.message === 'string') {
        data.push({
          fieldName: item.fieldName,
          message: await this.i18n.translate(item.message, { lang }),
        });
        continue;
      }
    }
    return data;
  }
}
