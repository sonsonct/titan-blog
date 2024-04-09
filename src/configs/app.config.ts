import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConst } from '../commons/consts/app.const';

class AppConfig {
  get appName(): string {
    return process.env.APP_NAME || 'App_Name_ABC';
  }

  get serviceName(): string {
    return process.env.SERVICE_NAME || 'blog';
  }

  get nodeEnv(): string {
    return process.env.NODE_ENV || AppConst.ENVIRONMENT.LOCAL;
  }

  get isLocal(): boolean {
    return this.nodeEnv === AppConst.ENVIRONMENT.LOCAL;
  }

  get isProduction(): boolean {
    return this.nodeEnv === AppConst.ENVIRONMENT.PRODUCTION;
  }

  get port(): number {
    return parseInt(process.env.PORT || '8686');
  }

  get otpConfig() {
    return {
      expiresIn: parseInt(process.env.TIME_OTP) || 60,
      otpLength: parseInt(process.env.OTP_LENGTH) || 6,
      defaultOTP: process.env.DEFAULT_OTP,
    };
  }


  get encryptKey() {
    return {
      loginKey: process.env.LOGIN_SECRET_KEY,
      appKey: process.env.APP_SECRET_KEY,
      expiresIn: parseInt(process.env.APP_KEY_EXPIRATION_TIME) || 900,
    };
  }

  get hashKey() {
    return {
      otpKey: process.env.OTP_HASH_KEY,
    };
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,

      synchronize: false,
      entities: [join(__dirname, '../database/entities/*.entity{.js,.ts}')],
      migrations: [
        join(__dirname, '../database/migrations/**/*{.js,.ts}'),
        join(__dirname, '../database/migrations-data/**/*{.js,.ts}'),
      ],
      migrationsRun: true,
      logging: process.env.ENABLE_ORM_LOGS === 'true' ? 'all' : ['error', 'migration'],

      extra: {
        connectionTimeoutMillis: 30000, // 30s
        idleTimeoutMillis: 10000, // 10s
        max: 50,
      },
    };
  }

  get mailConfig() {
    return {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    };
  }

}

export const appConfig = new AppConfig();
