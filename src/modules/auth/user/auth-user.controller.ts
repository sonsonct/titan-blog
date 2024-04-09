import { Body, Controller, FileTypeValidator, Get, HttpCode, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, Put, Req, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../auth.service";
import { AuthGuard } from "@nestjs/passport";
import { ManageRoles, OtpType, S3_FOLDER, SocialLoginName } from "src/commons/enums";
import { RegisterDto } from "../dto/user-dto/register.dto";
import { VerifyOtpDto } from "src/modules/otp/dto/verify-otp.dto";
import { UpdateUserPasswordDto } from "../dto/update-password.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { LoginDto } from "../dto/login.dto";
import { UpdateNameDto } from "../dto/update-username-user.dto";
import { LoginSocialDto } from "../dto/user-dto/login-social.dto";
import { ForgotPasswordDto } from "../dto/forgot-password.dto";
import { SendOtpToMailDto } from "src/modules/otp/dto/send-otp-to-mail.dto";
import { SetRoles } from "src/nest/decorators/set-roles.decorator";
import { ApplyAuthGuard } from "src/nest/guards/auth.guard";
import { S3Service } from "src/modules/s3/s3.service";
import { httpBadRequest } from "src/nest/exceptions/http-exception";
import { RecaptchaGuard } from "src/nest/guards/recaptcha.guard";

@ApiTags('Auth-User')
@Controller('user/auth')
export class UserAuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly s3Service: S3Service,
    ) { }

    @ApiResponse({
        description: 'Register success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Register user' })
    @ApiBody({ type: RegisterDto })
    @Post('register')
    @HttpCode(HttpStatus.OK)
    async register(@Body() body: RegisterDto) {
        return await this.authService.register(body);
    }

    @ApiResponse({
        description: 'Verify register OTP success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Verify register OTP' })
    @ApiBody({ type: VerifyOtpDto })
    @Post('verify-register')
    async verifyRegisterOtp(@Body() body: VerifyOtpDto) {
        body.otpType = OtpType.REGISTER;

        return await this.authService.verifyOtp(body);
    }

    @ApiResponse({
        description: 'Login success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({ type: LoginDto })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body() body: LoginDto) {
        return await this.authService.login(body)
    }

    @Get("facebook")
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin() {
    }

    @Get("facebook/redirect")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: Request) {
        const loginSocialDto = new LoginSocialDto;

        loginSocialDto.socialId = req['user'].user.id;
        loginSocialDto.socialName = SocialLoginName.FACEBOOK;

        return await this.authService.loginSocial(loginSocialDto);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() { }

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        const loginSocialDto = new LoginSocialDto;

        loginSocialDto.socialId = req['user'].id;
        loginSocialDto.socialName = SocialLoginName.GOOGLE;
        loginSocialDto.email = req['user'].email;

        return await this.authService.loginSocial(loginSocialDto);
    }

    @ApiOperation({ summary: 'My account' })
    @ApplyAuthGuard()
    @SetRoles(...ManageRoles)
    @Get('myAccount')
    async getMyAccount(@Request() req) {
        return await this.authService.getMyAccount(req.user.id);
    }

    @ApiOperation({ summary: 'Edit password' })
    @ApplyAuthGuard()
    @SetRoles(...ManageRoles)
    @Put('update-password')
    async changePassword(
        @Request() req,
        @Body() body: UpdateUserPasswordDto
    ) {
        return await this.authService.updatePassword(req.user.id, body);
    }

    @ApiOperation({ summary: 'Edit username' })
    @ApplyAuthGuard()
    @SetRoles(...ManageRoles)
    @Put('update-username')
    async changeUsername(
        @Request() req,
        @Body() body: UpdateNameDto
    ) {
        return await this.authService.updateUserName(req.user.id, body);
    }

    @ApiOperation({ summary: 'Edit avatar' })
    @ApplyAuthGuard()
    @SetRoles(...ManageRoles)
    @UseInterceptors(FileInterceptor('avatar'))
    @Put('update-avatar')
    async changeAvatar(
        @UploadedFile(new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg|mp4)' }),
            ],
        })) avatar: Express.Multer.File,
        @Request() req,
    ) {
        return await this.authService.updateAvatar(req.user.id, avatar);
    }

    @ApiResponse({
        description: 'Send OTP to email success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'forgot password send OTP to email' })
    @ApiBody({ type: SendOtpToMailDto })
    @UseGuards(RecaptchaGuard)
    @Post('send-email')
    async sendOtpToEmail(@Body() body: SendOtpToMailDto) {
        body.otpType = OtpType.FORGET_PASSWORD;

        return await this.authService.processSendOtp(body);
    }

    @ApiResponse({
        description: 'Verify OTP success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Verify OTP' })
    @ApiBody({ type: VerifyOtpDto })
    @Post('verify')
    async verifyOtp(@Body() body: VerifyOtpDto) {
        body.otpType = OtpType.FORGET_PASSWORD;

        return await this.authService.verifyOtp(body);
    }

    @ApiResponse({
        description: 'send mail success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Forgot password' })
    @ApiBody({ type: ForgotPasswordDto })
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() body: ForgotPasswordDto) {
        return await this.authService.forgotPassword(body);
    }
}