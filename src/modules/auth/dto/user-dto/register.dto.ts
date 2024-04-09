import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  @IsEmail()
  public email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  public newPassword: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  public reTypeNewPassword: string;

  @IsOptional()
  public username: string;
}
