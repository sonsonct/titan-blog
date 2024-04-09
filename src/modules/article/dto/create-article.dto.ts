import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateArticleDto {
    authorId: number;

    @ApiProperty({ type: 'boolean' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    isPublic: boolean;

    @ApiProperty({ type: 'number' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    categoryId: number;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    title: string;

    @IsOptional()
    thumbnail: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    content: string;

    @ApiProperty({ type: [String] })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    hashtags: string[];
}