import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  public otpSignature: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  public email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  public otp: string;

  public otpType: string;
}
