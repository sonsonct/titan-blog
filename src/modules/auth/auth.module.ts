import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from '../../repositories/user.repository';
import { OtpRepository } from '../../repositories/otp.repository';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { AdminAuthController } from './admin/auth-admin.controller';
import { FacebookStrategy } from './user/login-strategy/facebook.strategy';
import { SocialLoginRepository } from 'src/repositories/login-social.repository';
import { UserAuthController } from './user/auth-user.controller';
import { GoogleStrategy } from './user/login-strategy/google.strategy';
import { IpBlockRepository } from 'src/repositories/ipblock.repository';
import { S3Service } from '../s3/s3.service';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository, OtpRepository, SocialLoginRepository, IpBlockRepository]), HttpModule],
  controllers: [AdminAuthController, UserAuthController],
  providers: [AuthService, FacebookStrategy, GoogleStrategy, S3Service],
  exports: [],
})
export class AuthModule { }
