import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateNotificationDto {
    userId: number;

    articleId: number;

    type: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    title: string;
}