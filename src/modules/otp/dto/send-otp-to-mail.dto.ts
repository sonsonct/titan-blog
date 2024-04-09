import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export class SendOtpToMailDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }) => value?.toLowerCase())
  public email: string;

  public otpType: string;
}