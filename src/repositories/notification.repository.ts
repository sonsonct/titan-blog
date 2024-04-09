import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";
import { Notification } from "../database/entities/notification.entity";
import { TypeORMRepository } from "src/database/typeorm.repository";
import { GetListNotificationDto } from "../modules/notification/dto/list-notification.dto";
import { CreateNotificationDto } from "src/modules/notification/dto/create-notification.dto";
import { NotificationHideRead, NotificationType } from "src/commons/enums";

@CustomRepository(Notification)
export class NotificationRepository extends TypeORMRepository<Notification> {
    async getListNotification(getListNotificationDto: GetListNotificationDto) {
        const { userId, isRead, sortField = 'id', sortType = -1, page, pageSize } = getListNotificationDto;
        const queryBuilder = this.createQueryBuilder('notification')
            .where('notification.userId =:userId', { userId: userId });

        if (isRead == NotificationHideRead.HIDE_READ) {
            queryBuilder.andWhere('notification.isRead = false');
        }

        if (isRead == NotificationHideRead.READ) {
            queryBuilder.andWhere('notification.isRead = true');
        }

        queryBuilder.orderBy(`notification.${sortField}`, sortType > 0 ? 'ASC' : 'DESC');

        return this.list({
            page: page,
            limit: pageSize,
        }, { queryBuilder });
    }

    async createNotification({ article, receiverId, senderName, type }) {
        const createNotificationDto = new CreateNotificationDto;
        createNotificationDto.title = await this.getNotificationTitle(type, senderName, article.title);
        createNotificationDto.userId = receiverId;
        createNotificationDto.articleId = article.id;
        createNotificationDto.type = type;

        return await this.insert(createNotificationDto);
    }

    async getNotificationTitle(type: NotificationType, senderName: string, articleTitle: string) {
        let title = '';
        switch (type) {
            case NotificationType.COMMENT:
                title = `${senderName} comment on your article:"${articleTitle}"`;
                break;
            case NotificationType.REP_COMMENT:
                title = `${senderName} reply to your comment in the article:"${articleTitle}"`;
                break;
            case NotificationType.LIKE_COMMENT:
                title = `${senderName} like your comment in the article:"${articleTitle}"`;
                break;
            case NotificationType.LIKE:
                title = `${senderName} like your article:"${articleTitle}"`;
                break;
            default:
                break;
        }
        return title;
    }

}