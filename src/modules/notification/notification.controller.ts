import { Controller, Get, HttpCode, HttpStatus, Param, Put, Query, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ManageRoles } from 'src/commons/enums';
import { GetListNotificationDto } from './dto/list-notification.dto';
import { SetRoles } from 'src/nest/decorators/set-roles.decorator';
import { ApplyAuthGuard } from 'src/nest/guards/auth.guard';

@ApiTags("notification")
@Controller('notifications')
export class NotificationController {
    constructor(
        private notificationService: NotificationService,
    ) { }

    @ApiResponse({
        description: 'get notification success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'get notification' })
    @ApplyAuthGuard()
    @SetRoles(...ManageRoles)
    @Get('')
    @HttpCode(HttpStatus.OK)
    async listNotification(
        @Query() query: GetListNotificationDto,
        @Request() req
    ) {
        query.userId = +req.user.id;

        return await this.notificationService.getListNotification(query);
    }

    @ApiResponse({
        description: 'read notification success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'read notification' })
    @ApplyAuthGuard()
    @SetRoles(...ManageRoles)
    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    async readNotification(
        @Param('id') id: number,
    ) {
        return await this.notificationService.readNotification(id);
    }

    @ApiResponse({
        description: 'read all notification success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'read all notification' })
    @ApplyAuthGuard()
    @SetRoles(...ManageRoles)
    @Put('/:userId/all')
    @HttpCode(HttpStatus.OK)
    async readAllNotification(
        @Param('userId') userId: number,
    ) {
        return await this.notificationService.readAllNotification(userId);
    }
}
