import { MailerOptions } from '@nestjs-modules/mailer';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

export const mailConfig: MailerOptions = {
  transport: {
    host: process.env.MAIL_HOST,
    port: +process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  }
};