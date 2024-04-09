import { IsOptional } from "class-validator";
import { ListQueryDto } from "src/commons/dtos/list-query.dto";

export class GetListCategoryDto extends ListQueryDto {
    @IsOptional()
    role?: string;
}
