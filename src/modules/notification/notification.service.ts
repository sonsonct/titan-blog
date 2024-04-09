import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../repositories/notification.repository';
import { GetListNotificationDto } from './dto/list-notification.dto';
import { ResponseBuilder } from 'src/utils/response-builder';
import { ResponseCodeEnum } from 'src/commons/enums';

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationRepository: NotificationRepository,
    ) { }
    async getListNotification(getListNotificationDto: GetListNotificationDto) {
        return await this.notificationRepository.getListNotification(getListNotificationDto);
    }

    async readNotification(id: number) {
        const notificationUpdate = await this.notificationRepository.update(id, { isRead: true });

        return new ResponseBuilder(notificationUpdate)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async readAllNotification(userId: number) {
        const notificationUpdate = await this.notificationRepository.update({ userId: userId }, { isRead: true });

        return new ResponseBuilder(notificationUpdate)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }
}
