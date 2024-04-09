import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { ListQueryDto } from "src/commons/dtos/list-query.dto";


export class GetListArticleDto extends ListQueryDto {
    @ApiProperty({
        type: 'string',
        required: false,
        description: 'category name',
    })
    @IsOptional()
    public category?: string;

    @ApiProperty({
        type: 'string',
        required: false,
        description: 'hashtag name',
    })
    @IsOptional()
    public hashtag?: string;

    @IsOptional()
    public role?: string;
}
