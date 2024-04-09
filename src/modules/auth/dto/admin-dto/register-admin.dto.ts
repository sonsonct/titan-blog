import { IsOptional } from 'class-validator';
import { RegisterDto } from '../user-dto/register.dto';

export class RegisterAdminDto extends RegisterDto {
    @IsOptional()
    public role: string = 'ADMIN';
}
