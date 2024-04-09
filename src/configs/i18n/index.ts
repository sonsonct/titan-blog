import { Module } from '@nestjs/common';
import {
  I18nModule,
  QueryResolver,
  CookieResolver,
  HeaderResolver,
  I18nJsonLoader,
  AcceptLanguageResolver,
} from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      fallbacks: {
        'en-*': 'en',
        'vi-*': 'vi',
      },
      loader: I18nJsonLoader,
      loaderOptions: {
        path: __dirname,
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
        new CookieResolver(['lang', 'locale', 'l']),
      ],
    }),
  ],
})
export default class I18nConfigModule {}
