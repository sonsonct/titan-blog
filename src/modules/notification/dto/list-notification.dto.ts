import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { ListQueryDto } from "src/commons/dtos/list-query.dto";
import { NotificationHideRead } from "src/commons/enums";

export class GetListNotificationDto extends ListQueryDto {
    userId: number;

    @ApiProperty({ enum: NotificationHideRead, required: false })
    @IsOptional()
    @IsEnum(NotificationHideRead)
    isRead: NotificationHideRead;
}