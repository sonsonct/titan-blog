import { CommentUserLikesDto } from './dto/create-likes-comment.dto';
import { CreateCommentDto, CreateReplyCommentDto } from './dto/create-comment.dto';
import { CommentRepository } from '../../repositories/comment.repository';
import { Injectable } from '@nestjs/common';
import { ListCommentDto, ListSubCommentDto } from './dto/find-comment.dto';
import { httpBadRequest, httpNotFound } from 'src/nest/exceptions/http-exception';
import { NotificationType, ResponseCodeEnum, RoleScope, StatisticalType } from 'src/commons/enums';
import { NotificationRepository } from '../../repositories/notification.repository';
import { ArticleRepository } from '../../repositories/article.repository';
import { UserRepository } from '../../repositories/user.repository';
import { Comment } from 'src/database/entities/comment.entity';
import { StatisticalRepository } from 'src/repositories/statistical.repository';
import { ResponseBuilder } from 'src/utils/response-builder';

@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly notificationRepository: NotificationRepository,
        private readonly articleRepository: ArticleRepository,
        private readonly userRepository: UserRepository,
        private readonly statisticalRepository: StatisticalRepository,
    ) { }

    async createComment(createCommentDto: CreateCommentDto) {
        const article = await this.getArticleById(createCommentDto.articleId);

        if (article.authorId != createCommentDto.userId) {
            const user = await this.userRepository.findOneBy({ id: createCommentDto.userId });

            const data = {
                article: article,
                receiverId: article.authorId,
                senderName: user.username,
                type: NotificationType.COMMENT
            }

            await this.notificationRepository.createNotification(data);
        }

        await this.statisticalRepository.addStatistical(StatisticalType.COMMENT);
        await this.articleRepository.update({ id: createCommentDto.articleId }, { commentCount: article.commentCount + 1 });

        const commentInsert = await this.commentRepository.insert(createCommentDto);

        return new ResponseBuilder(commentInsert)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async repComment(createReplyCommentDto: CreateReplyCommentDto) {
        const { parentId, userId } = createReplyCommentDto;
        const comment = await this.checkExistedComment(parentId);
        const article = await this.getArticleById(comment.articleId);
        const user = await this.userRepository.findOneBy({ id: userId });

        createReplyCommentDto.articleId = comment.articleId;

        const data = {
            article: article,
            receiverId: null,
            senderName: user.username,
            type: null,
        }

        if (article.authorId != userId) {
            data.receiverId = article.authorId
            data.type = NotificationType.COMMENT
            await this.notificationRepository.createNotification(data);
        }

        if (userId != comment.userId) {
            data.receiverId = comment.userId
            data.type = NotificationType.REP_COMMENT
            await this.notificationRepository.createNotification(data);
        }

        await this.statisticalRepository.addStatistical(StatisticalType.REP_COMMENT);
        await this.articleRepository.update({ id: article.id }, { commentCount: article.commentCount + 1 });

        const commentReply = await this.commentRepository.insert(createReplyCommentDto);

        return new ResponseBuilder(commentReply)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async deleteComment(id: number, req: Request) {
        const comment = await this.checkExistedComment(id);
        const article = await this.getArticleById(comment.articleId);

        if (comment.userId !== req['user'].id && req['user'].role !== RoleScope.ADMIN) {
            throw new httpBadRequest("YOU_NOT_AUTHOR_COMMENT");
        }

        await this.statisticalRepository.addStatistical(StatisticalType.DELETE_COMMENT);

        const commentDelete = await this.commentRepository.update(id, { deleted: true });

        await this.articleRepository.update({ id: article.id }, { commentCount: article.commentCount - 1 });

        return new ResponseBuilder(commentDelete)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async getListComment(query: ListCommentDto) {
        return this.commentRepository.listComment(query);
    }

    async getListSubComment(query: ListSubCommentDto) {
        return this.commentRepository.listSubComment(query);
    }

    async likeComment(commentUserLikesDto: CommentUserLikesDto) {
        const { commentId, userId } = commentUserLikesDto;
        const [comment, user, liked] = await Promise.all([
            this.checkExistedComment(commentId),
            this.userRepository.findOneBy({ id: userId }),
            this.commentRepository.checkLiked({ commentId, userId }),
        ]);

        const article = await this.getArticleById(comment.articleId);

        const query = this.commentRepository
            .createQueryBuilder()
            .relation(Comment, 'likes')
            .of(comment);

        if (liked) {
            await query.remove(user);
            await this.statisticalRepository.addStatistical(StatisticalType.UNLIKE_COMMENT);
        } else {
            await query.add(user);

            if (comment.userId != userId) {
                const data = {
                    article: article,
                    receiverId: comment.userId,
                    senderName: user.username,
                    type: NotificationType.LIKE_COMMENT,
                }
                await this.notificationRepository.createNotification(data);
            }

            await this.statisticalRepository.addStatistical(StatisticalType.LIKE_COMMENT);
        }

        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async checkExistedComment(id: number) {
        const comment = await this.commentRepository.findOneBy({ id });

        if (!comment) {
            throw new httpNotFound("COMMENT_NOT_EXISTS");
        }

        return comment;
    }

    async getArticleById(id: number) {
        const article = await this.articleRepository.findOneBy({ id, deleted: false, isPublic: true });

        if (!article) {
            throw new httpNotFound("ARTICLE_NOT_EXISTS");
        }

        return article;
    }
}
