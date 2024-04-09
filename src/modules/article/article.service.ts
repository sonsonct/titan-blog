import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleRepository } from '../../repositories/article.repository';
import { Injectable } from '@nestjs/common';
import { GetListArticleDto } from './dto/list-article.dto';
import { HashtagRepository } from '../../repositories/hashtag.repository';
import { httpBadRequest, httpNotFound } from 'src/nest/exceptions/http-exception';
import { ArticleUserLikesDto } from './dto/create-likes-article.dto';
import { NotificationRepository } from '../../repositories/notification.repository';
import { UserRepository } from '../../repositories/user.repository';
import { NotificationType, ResponseCodeEnum, S3_FOLDER, StatisticalType } from 'src/commons/enums';
import { Article } from 'src/database/entities/article.entity';
import { StatisticalRepository } from 'src/repositories/statistical.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { ResponseBuilder } from 'src/utils/response-builder';
import { S3Service } from '../s3/s3.service';


@Injectable()
export class ArticleService {
    constructor(
        private readonly articleRepository: ArticleRepository,
        private readonly hashtagRepository: HashtagRepository,
        private readonly notificationRepository: NotificationRepository,
        private readonly userRepository: UserRepository,
        private readonly statisticalRepository: StatisticalRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly s3Service: S3Service,
    ) { }

    async createArticle(data: CreateArticleDto, thumbnail: Express.Multer.File) {
        const { hashtags, ...articleData } = data;
        await this.checkCategoryExists(articleData.categoryId);

        if (thumbnail != null) {
            const { originalname, buffer } = thumbnail;
            const media = await this.s3Service.uploadS3(
                S3_FOLDER.THUMBNAIL,
                buffer,
                originalname,
            );
            articleData.thumbnail = media.Key;
        }

        const article = await this.articleRepository.save(articleData);

        if (hashtags.length > 0) {
            await this.insertHashtag(hashtags, article);
        }

        return new ResponseBuilder(article)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async updateArticle(id: number, data: UpdateArticleDto, thumbnail: Express.Multer.File) {
        const { hashtags, ...articleData } = data;
        const article = await this.checkArticleExists(id);
        await this.checkCategoryExists(articleData.categoryId);

        if (hashtags.length > 0) {
            await this.hashtagRepository.deleteHashtag(article.id);
            await this.insertHashtag(hashtags, article);
        }

        articleData.thumbnail = article.thumbnail;

        if (thumbnail) {
            if (thumbnail.size > 1024 * 1024 * 10) {
                throw new httpBadRequest("FILE < 10M");
            }

            const allowedTypes = ['.png', '.jpeg', '.jpg', '.mp4'];
            const fileExtension = thumbnail.originalname.substring(thumbnail.originalname.lastIndexOf('.')).toLowerCase();
            if (!allowedTypes.includes(fileExtension)) {
                throw new httpBadRequest("Invalid file type. Only PNG, JPEG, and JPG are allowed.");
            }

            await this.s3Service.deleteS3(article.thumbnail);

            const { originalname, buffer } = thumbnail;
            const media = await this.s3Service.uploadS3(
                S3_FOLDER.THUMBNAIL,
                buffer,
                originalname,
            );
            articleData.thumbnail = media.Key;
        }

        const articleUpdate = await this.articleRepository.update(id, articleData);

        return new ResponseBuilder(articleUpdate)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async deleteArticle(id: number) {
        await this.checkArticleExists(id);

        const articleDelete = await this.articleRepository.update({ id }, { deleted: true });

        return new ResponseBuilder(articleDelete)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async getArticle({ id, role }) {
        const article = await this.articleRepository.getDetailArticle({ id, role });

        if (!article) {
            throw new httpNotFound("Article not found");
        }

        await this.statisticalRepository.addStatistical(StatisticalType.VIEW);

        await this.articleRepository.update(id, { viewCount: article.viewCount + 1 });

        return new ResponseBuilder(article)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async getListArticle(query: GetListArticleDto) {
        return await this.articleRepository.getListArticle(query);
    }

    async getListHotArticle(query: GetListArticleDto) {
        const articles = await this.articleRepository.getListHotArticle(query);

        return new ResponseBuilder(articles)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async likeArticle(articleUserLikesDto: ArticleUserLikesDto) {
        const { userId, articleId } = articleUserLikesDto;
        const [user, liked, article] = await Promise.all([
            this.userRepository.findOneBy({ id: userId }),
            this.articleRepository.checkUserLiked({ articleId, userId }),
            this.checkArticleExists(articleId),
        ]);
        const query = this.articleRepository
            .createQueryBuilder()
            .relation(Article, 'likes')
            .of(article);

        if (liked) {
            await this.statisticalRepository.addStatistical(StatisticalType.UNLIKE);

            await query.remove(user);

            await this.articleRepository.update({ id: articleId }, { likeCount: article.likeCount - 1 });
        } else {
            await query.add(user);

            await this.articleRepository.update({ id: articleId }, { likeCount: article.likeCount + 1 });

            if (userId != article.authorId) {
                const data = {
                    article: article,
                    receiverId: article.authorId,
                    senderName: user.username,
                    type: NotificationType.LIKE
                }

                await this.notificationRepository.createNotification(data);
            }

            await this.statisticalRepository.addStatistical(StatisticalType.LIKE);
        }

        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async uploadFileS3(file: Express.Multer.File) {
        try {
            const { originalname, buffer } = file;
            const result = await this.s3Service.uploadS3(
                S3_FOLDER.IMAGES,
                buffer,
                originalname,
            );
            const url = result['key'];

            return new ResponseBuilder({ url: url })
                .withCode(ResponseCodeEnum.SUCCESS)
                .build();
        } catch (error) {
            throw httpBadRequest(error)
        }
    }

    async checkArticleExists(id: number) {
        const article = await this.articleRepository.findOneBy({
            id,
            deleted: false
        });

        if (!article) {
            throw new httpNotFound("ARTICLE_NOT_FOUND");
        }

        return article;
    }

    async checkCategoryExists(id: number) {
        const category = await this.categoryRepository.findOneBy({ id });

        if (!category) {
            throw new httpNotFound("CATEGORY_NOT_FOUND");
        }

        return category;
    }

    async insertHashtag(hashtags: string[], article: Article) {
        hashtags.forEach(async (hashtagName) => {
            let existHashtag = await this.hashtagRepository.findOneBy({ hashtagName });
            let newHashtag = existHashtag;

            if (!existHashtag) {
                newHashtag = await this.hashtagRepository.save({ hashtagName });
            }

            await this.articleRepository
                .createQueryBuilder()
                .relation(Article, 'hashtags')
                .of(article).add(newHashtag);
        });
    }
}
