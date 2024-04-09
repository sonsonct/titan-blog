import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { CommonStatus } from '../enums';


export class ListQueryDto {
  @ApiProperty({
    type: 'number',
    required: false,
    description: 'Page number of list',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public page?: number;

  @ApiProperty({
    type: 'number',
    required: false,
    description: 'Page size number of list',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public pageSize?: number;

  @ApiProperty({
    enum: CommonStatus,
    required: false,
    description: 'Status in common',
  })
  @IsOptional()
  @IsEnum(CommonStatus)
  public status?: string | number; // common statuss

  @ApiProperty({
    type: 'string',
    required: false,
    description: 'Search key',
  })
  @IsOptional()
  public searchKey?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    description: '',
  })
  @IsOptional()
  public sortField?: string;

  @ApiProperty({
    type: 'number',
    required: false,
    description: '1: ASC, -1: DESC',
  })

  @IsOptional()
  public sortType?: number;
}

export class ListQueryDto2 {
  @ApiProperty({
    type: 'number',
    required: false,
    description: 'cursor comment id',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public cursor?: number;

  @ApiProperty({
    type: 'number',
    required: false,
    description: 'Page number of list',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public pageSize?: number;
}


