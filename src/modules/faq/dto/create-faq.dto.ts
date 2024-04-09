import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateFaqDto {
    authorId: number;

    @ApiProperty({ type: 'number' })
    @IsOptional()
    categoryId: number;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    question: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    answer: string;

    @ApiProperty({ type: 'boolean' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    isPublic: boolean;
}