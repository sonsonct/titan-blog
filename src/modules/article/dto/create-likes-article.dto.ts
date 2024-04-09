import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ArticleUserLikesDto {
    @ApiProperty({ type: 'number' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    userId: number;

    @ApiProperty({ type: 'number' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    articleId: number;
}