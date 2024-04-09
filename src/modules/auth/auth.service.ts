import { Injectable } from '@nestjs/common';
import { OtpStatus, OtpType, ResponseCodeEnum, RoleScope, S3_FOLDER, SocialLoginName, UserStatus } from '../../commons/enums';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../database/entities/user.entity';
import { RegisterDto } from './dto/user-dto/register.dto';
import { appConfig } from '../../configs/app.config';
import { comparePassword, hashPassword } from 'src/utils/brcypt-password';
import { httpBadRequest, httpNotFound } from 'src/nest/exceptions/http-exception';
import { SocialLoginRepository } from 'src/repositories/login-social.repository';
import { OtpRepository } from 'src/repositories/otp.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyOtpDto } from '../otp/dto/verify-otp.dto';
import { Otp } from 'src/database/entities/otp.entity';
import { UpdateUserPasswordDto } from './dto/update-password.dto';
import { Not } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdateNameDto } from './dto/update-username-user.dto';
import { LoginSocialDto } from './dto/user-dto/login-social.dto';
import { BlockDto } from './dto/admin-dto/block.dto';
import { IpBlockRepository } from 'src/repositories/ipblock.repository';
import { BasicAuth } from 'src/nest/common/auth/basic-auth';
import { RegisterAdminDto } from './dto/admin-dto/register-admin.dto';
import { addTime } from 'src/utils/date.util';
import { ResponseBuilder } from 'src/utils/response-builder';
import { decryptSignature, encryptSignature, randomNumber } from 'src/utils/otp-genarate';
import { S3Service } from '../s3/s3.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly socialLoginRepository: SocialLoginRepository,
    private readonly otpRepository: OtpRepository,
    private readonly mailerService: MailerService,
    private readonly ipBlockRepository: IpBlockRepository,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService
  ) { }

  async registerAdmin(registerAdminDto: RegisterAdminDto) {
    await this.exitedUserByEmail(registerAdminDto.email);

    if (registerAdminDto.newPassword != registerAdminDto.reTypeNewPassword) {
      throw new httpBadRequest("INVALID_PASSWORD");
    }

    registerAdminDto.username = await this.generateUniqueUsername();

    const password = await hashPassword(registerAdminDto.newPassword);

    const adminInsert = await this.userRepository.insert({ email: registerAdminDto.email, password: password, username: registerAdminDto.username, role: registerAdminDto.role });

    return new ResponseBuilder(adminInsert)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async register(registerDto: RegisterDto) {
    await this.exitedUserByEmail(registerDto.email);

    if (registerDto.newPassword != registerDto.reTypeNewPassword) {
      throw new httpBadRequest("INVALID_PASSWORD");
    }

    const username = await this.generateUniqueUsername();
    const password = await hashPassword(registerDto.newPassword);
    const userInsert = await this.userRepository.insert({ email: registerDto.email, password: password, status: UserStatus.INACTIVE, username: username });

    return await this.processSendOtp({ userId: userInsert.identifiers[0].id, otpType: OtpType.REGISTER });
  }

  async loginSocial(userData: LoginSocialDto) {
    const social = await this.socialLoginRepository.findOneBy({ socialId: userData.socialId });
    let user;

    if (social) {
      user = await this.getUserById(social.userId);
    } else {
      const username = await this.generateUniqueUsername();
      const userInsert: any = {
        username
      }

      if (userData.socialName == SocialLoginName.GOOGLE) {
        userInsert.email = userData.email;
      }

      const insertedUser = await this.userRepository.insert(userInsert);
      const userId = insertedUser.identifiers[0].id;

      await this.socialLoginRepository.insert({ socialId: userData.socialId, userId, socialName: userData.socialName })

      user = await this.userRepository.findOneBy({ id: userId });
    }

    const token = await this.getToken(user);

    return new ResponseBuilder(token)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({
      email: loginDto.email,
      status: UserStatus.ACTIVE
    });

    if (!user) {
      throw new httpBadRequest("USER_NOT_EXIST");
    }

    if (loginDto.role == RoleScope.ADMIN && user.role != RoleScope.ADMIN) {
      throw new httpBadRequest("ADMIN_NOT_EXIST");
    }

    const isPasswordCorrect = await comparePassword(loginDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new httpBadRequest("INCORRECT_PASSWORD");
    }

    const token = await this.getToken(user);

    return new ResponseBuilder(token)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async getMyAccount(id: number) {
    const user = await this.userRepository.getUserInfo(id);

    if (!user) {
      throw new httpNotFound("USER_NOT_FOUND");
    }

    return new ResponseBuilder(user)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto) {
    const { oldPassword, newPassword, reTypeNewPassword } = updateUserPasswordDto;
    const user = await this.getUserById(id);

    const isPasswordCorrect = await comparePassword(oldPassword, user.password);

    if (!isPasswordCorrect) {
      throw new httpBadRequest("The old password is incorrect. Please try again.");
    }

    if (newPassword != reTypeNewPassword) {
      throw new httpBadRequest("New password and confirm new password do not match. Please try again.");
    }

    if (newPassword == oldPassword) {
      throw new httpBadRequest("New password and confirm new password do not match. Please try again.");
    }

    const userUpdate = await this.userRepository.update(id, { password: await hashPassword(newPassword) });

    return new ResponseBuilder(userUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async updateUserName(id: number, updateUserNameDto: UpdateNameDto) {
    await this.getUserById(id);

    const isExistName = await this.userRepository.findOneBy({ id: Not(id), username: updateUserNameDto.username });

    if (isExistName) {
      throw new httpBadRequest("This name is already taken, please try another name");
    }

    const userUpdate = await this.userRepository.update(id, { username: updateUserNameDto.username });

    return new ResponseBuilder(userUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async updateAvatar(id: number, avatar: Express.Multer.File) {
    if (!avatar) {
      throw new httpBadRequest("Invalid avatar")
    }

    const { buffer, originalname } = avatar;
    const media = await this.s3Service.uploadS3(
      S3_FOLDER.AVATARS,
      buffer,
      originalname
    );
    const user = await this.getUserById(id);

    await this.s3Service.deleteS3(user.avatar);

    const avatarUrl = media.Key;
    const userUpdate = await this.userRepository.update(id, { avatar: avatarUrl });

    return new ResponseBuilder(userUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async blockUser(blockDto: BlockDto) {
    if (blockDto.userId) {
      const user = await this.userRepository.findOneBy({ id: blockDto.userId, role: Not(RoleScope.ADMIN) });

      if (!user) {
        throw new httpNotFound("USER_NOT_FOUND");
      }

      await this.userRepository.update(blockDto.userId, { status: UserStatus.BLOCK });
    }

    if (blockDto.ip) {
      const ipBlocked = await this.ipBlockRepository.findOneBy({ ip: blockDto.ip });

      if (ipBlocked) {
        throw new httpBadRequest("Ip has been blocked");
      }

      await this.ipBlockRepository.insert({ ip: blockDto.ip });
    }

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { newPassword, reTypeNewPassword, codeSignature } = forgotPasswordDto;
    const data = await decryptSignature(codeSignature);
    const otpCode = await this.otpRepository.findOneBy({ id: data.otpId });

    if (!data) {
      throw new httpBadRequest("FORGOT_PASSWORD_ERROR");
    }

    if (otpCode.status != OtpStatus.OTP_USED) {
      throw new httpBadRequest("FORGOT_PASSWORD_ERROR");
    }

    await this.otpRepository.update({ id: data.otpId }, { status: OtpStatus.CODE_USED });

    if (newPassword != reTypeNewPassword) {
      throw new httpBadRequest("INVALID_PASSWORD");
    }

    const userUpdate = await this.userRepository.update({
      email: data.email
    }, {
      password: await hashPassword(newPassword)
    });

    return new ResponseBuilder(userUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async processSendOtp(body: any) {
    try {
      const data = await this.getMailSend(body);
      const mail = await this.mailerService.sendMail(data.mail);

      if (!mail.messageId) {
        throw httpBadRequest("CAN_NOT_SEND_MAIL");
      }

      return new ResponseBuilder({
        otpSignature: data.generateOTP.otpDetailEncoded,
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();

    } catch (error) {
      throw new httpBadRequest(error);
    }
  }

  async generateOTP(data: any) {
    const otpCode = await randomNumber(parseInt(process.env.MIN_OTP), parseInt(process.env.MAX_OTP));
    const now = new Date();
    const expirationTime = addTime(now, appConfig.otpConfig.expiresIn, 'seconds');
    const preparedOtp = {
      otpCode,
      expirationTime,
    };
    const insertResult = await this.otpRepository.insert(preparedOtp);
    const otpDetails = {
      timestamp: now,
      userId: data.userId,
      otpType: data.otpType,
      success: true,
      otpId: insertResult.identifiers[0].id,
    };
    const otpDetailEncoded = encryptSignature(otpDetails);

    return {
      otpCode: otpCode,
      otpDetailEncoded: otpDetailEncoded
    }
  }

  async verifyOtp(body: VerifyOtpDto) {
    const otpDetails = decryptSignature(body.otpSignature);
    const user = await this.getUserById(otpDetails.userId);

    if (user.email != body.email) {
      throw new httpBadRequest("EMAIL_NOT_EXISTS");
    }

    const otpInstance = await this.otpRepository.detailById(otpDetails.otpId);

    if (!otpInstance || otpInstance.status != OtpStatus.CREATED || otpInstance.otpCode != body.otp) {
      throw new httpBadRequest("OTP_INVALID");
    }

    if (otpInstance.expirationTime < new Date()) {
      throw new httpBadRequest("OTP_EXPIRED");
    }

    const paramsUpdate: Otp = {
      status: OtpStatus.OTP_USED,
    } as Otp;

    await this.otpRepository.update(otpDetails.otpId, paramsUpdate);

    if (body.otpType == OtpType.REGISTER) {
      const userUpdate = await this.userRepository.update({ id: otpDetails.userId }, { status: UserStatus.ACTIVE });

      return new ResponseBuilder(userUpdate)
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();

    } else if (body.otpType == OtpType.FORGET_PASSWORD) {

      const codeSignature = encryptSignature({
        email: user.email,
        otpId: otpDetails.otpId,
      });

      return new ResponseBuilder({
        codeSignature,
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    }
  }

  async generateUniqueUsername() {
    let username;
    let isUnique = false;

    while (!isUnique) {
      const randomNumber = Math.floor(Math.random() * 1000);

      username = `user${randomNumber}`;

      const existingUser = await this.userRepository.findOneBy({ username: username });

      if (!existingUser) {
        isUnique = true;
      }
    }

    return username;
  }

  async getToken(data: User) {
    const tokenPayload = {
      id: data.id,
      email: data.email,
      role: data.role,
    };
    const accessToken = BasicAuth.signToken(tokenPayload);

    return {
      accessToken
    };
  }

  async exitedUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      throw new httpBadRequest("EMAIL_ALREADY_EXIST");
    }

    return true;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new httpNotFound("USER_NOT_FOUND");
    }

    return user;
  }

  async getMailSend(body: any) {
    let userData = {
      otpType: body.otpType,
      email: null,
      userId: null,
    }

    if (body.otpType == OtpType.REGISTER) {
      const user = await this.getUserById(body.userId);
      userData.userId = body.userId;
      userData.email = user.email;
    }
    else if (body.otpType == OtpType.FORGET_PASSWORD) {
      const checkUserExists = await this.userRepository.findOneBy({ email: body.email });

      if (!checkUserExists) {
        throw new httpNotFound("EMAIL_NOT_FOUND");
      }
      userData.userId = checkUserExists.id;
      userData.email = checkUserExists.email;
    }

    const generateOTP = await this.generateOTP(userData);

    return {
      mail: {
        from: this.configService.get("MAIL_FROM"),
        to: userData.email,
        subject: body.otpType,
        text: `otp code: ${generateOTP.otpCode}`
      },
      generateOTP: generateOTP,
    }
  }
}
