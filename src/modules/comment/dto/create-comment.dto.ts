import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({ type: 'number' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    @IsOptional()
    articleId: number;

    userId: number;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    content: string;
}

export class CreateReplyCommentDto extends CreateCommentDto {
    @ApiProperty({ type: 'number' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    parentId: number;
}