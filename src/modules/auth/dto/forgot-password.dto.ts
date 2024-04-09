import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    newPassword: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    reTypeNewPassword: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    codeSignature: string;
}