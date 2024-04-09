import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../auth.service";
import { Body, Controller, Delete, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { VerifyOtpDto } from "../../otp/dto/verify-otp.dto";
import { SendOtpToMailDto } from "../../otp/dto/send-otp-to-mail.dto";
import { OtpType, RoleScope } from "src/commons/enums";
import { LoginDto } from "../dto/login.dto";
import { ForgotPasswordDto } from "../dto/forgot-password.dto";
import { BlockDto } from "../dto/admin-dto/block.dto";
import { SetRoles } from "src/nest/decorators/set-roles.decorator";
import { ApplyAuthGuard } from "src/nest/guards/auth.guard";
import { RegisterAdminDto } from "../dto/admin-dto/register-admin.dto";
import { RecaptchaGuard } from "src/nest/guards/recaptcha.guard";

@ApiTags('Auth-admin')
@Controller('admin/auth')
export class AdminAuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @ApiResponse({
        description: 'Register success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Register admin' })
    @ApiBody({ type: RegisterAdminDto })
    @Post('/register')
    @HttpCode(HttpStatus.OK)
    async register(@Body() body: RegisterAdminDto) {
        return await this.authService.registerAdmin(body);
    }

    @ApiResponse({
        description: 'Login success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Login admin' })
    @ApiBody({ type: LoginDto })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async loginAdmin(@Body() body: LoginDto) {
        body.role = RoleScope.ADMIN;

        return await this.authService.login(body)
    }

    @ApiResponse({
        description: 'Send OTP to email success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'forgot password send OTP to email' })
    @ApiBody({ type: SendOtpToMailDto })
    @UseGuards(RecaptchaGuard)
    @Post('send-email')
    async sendOtpToEmail(@Body() body: any) {
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

    @ApiResponse({
        description: 'Block user  success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Block user' })
    @ApplyAuthGuard()
    @SetRoles(RoleScope.ADMIN)
    @ApiBody({ type: BlockDto })
    @Delete('block')
    @HttpCode(HttpStatus.OK)
    async blockUser(
        @Body() body: BlockDto,
    ) {
        return await this.authService.blockUser(body);
    }
}