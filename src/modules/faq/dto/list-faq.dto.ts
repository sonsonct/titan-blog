import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { ListQueryDto } from "src/commons/dtos/list-query.dto";

export class ListFaqDto extends ListQueryDto {
    @IsOptional()
    public role?: string;

    @ApiProperty({
        type: 'string',
        required: false,
        description: 'category name',
    })
    @IsOptional()
    public category?: string;
}
