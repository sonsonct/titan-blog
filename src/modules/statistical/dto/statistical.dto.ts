import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { FilterStatisticalType } from "src/commons/enums";


export class StatisticalDto {
    @ApiProperty({
        type: 'date',
        required: false,
        description: 'start date',
    })
    @IsOptional()
    public firstDay?: Date;

    @ApiProperty({
        type: 'date',
        required: false,
        description: 'end date',
    })
    @IsOptional()
    public endDate?: Date;

    @ApiProperty({ enum: FilterStatisticalType, required: false, default: FilterStatisticalType.DAILY })
    @IsOptional()
    @IsEnum(FilterStatisticalType)
    filter: FilterStatisticalType;
}