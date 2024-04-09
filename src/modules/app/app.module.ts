import { TypeOrmExModule } from './../commons/typeorm-ex/typeorm-ex.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import I18nConfigModule from '../../configs/i18n';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { ArticleModule } from '../article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from 'src/configs/typeorm';
import { CommentModule } from '../comment/comment.module';
import { FaqModule } from '../faq/faq.module';
import { NotificationModule } from '../notification/notification.module';
import { DatabaseModule } from 'src/database';
import { HashtagModule } from '../hashtag/hashtag.module';
import { StatisticalModule } from '../statistical/statistical.module';
import { IpBlockMiddleware } from 'src/nest/middleware/ip-block.middleware';
import { IpBlockRepository } from 'src/repositories/ipblock.repository';
import { HttpExceptionFilter } from 'src/nest/filters/http-exception.filter';
import { S3Module } from '../s3/s3.module';
import { MailsModule } from '../mails/mails.module';


@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([IpBlockRepository]),
    EventEmitterModule.forRoot(),
    MailsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
    }),
    DatabaseModule,
    I18nConfigModule,
    AuthModule,
    CategoryModule,
    ArticleModule,
    CommentModule,
    FaqModule,
    NotificationModule,
    HashtagModule,
    StatisticalModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpBlockMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
