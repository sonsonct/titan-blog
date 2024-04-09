import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";
import { Article } from "../database/entities/article.entity";
import { TypeORMRepository } from "src/database/typeorm.repository";
import { GetListArticleDto } from "../modules/article/dto/list-article.dto";
import { RoleScope } from "src/commons/enums";

@CustomRepository(Article)
export class ArticleRepository extends TypeORMRepository<Article> {
    async getListArticle(query: GetListArticleDto) {
        const {
            pageSize,
            page,
            hashtag,
            category,
            searchKey,
            sortField = 'id',
            sortType = -1,
            role
        } = query;

        const queryBuilder = this.createQueryBuilder('article')
            .leftJoinAndSelect('article.category', 'category')
            .leftJoinAndSelect('category.parentCategory', 'parentCategory')
            .leftJoinAndSelect('article.hashtags', 'hashtags')
            .where('parentCategory.id = category.parentId OR category.parentId IS NULL')
            .where('article.deleted = false')
            .loadRelationCountAndMap('article.likeCount', 'article.likes')
            .loadRelationCountAndMap('article.commentCount', 'article.comments');

        if (searchKey) {
            queryBuilder.andWhere('MATCH(article.title, article.content) AGAINST(:dataSearch IN NATURAL LANGUAGE MODE) OR hashtags.hashtagName LIKE :hashtagName or category.categoryName LIKE :categoryName', {
                dataSearch: searchKey,
                hashtagName: `%${searchKey}%`,
                categoryName: `%${searchKey}%`
            });
        }

        if (role != RoleScope.ADMIN) {
            queryBuilder.andWhere('article.isPublic = true');
        }

        if (category) {
            queryBuilder.andWhere('category.categoryName = :categoryName', {
                categoryName: category
            });
        }

        if (hashtag) {
            queryBuilder.andWhere('hashtags.hashtagName = :hashtagName', {
                hashtagName: hashtag
            });
        }

        queryBuilder.orderBy(`article.${sortField}`, sortType > 0 ? 'ASC' : 'DESC');

        return this.list(
            {
                page: page,
                limit: pageSize,
            },
            {
                queryBuilder,
            },
        );
    }

    async getListHotArticle(query: GetListArticleDto) {
        const { hashtag, category } = query;
        const queryBuilder = this.createQueryBuilder('article')
            .leftJoinAndSelect('article.category', 'category')
            .leftJoinAndSelect('article.hashtags', 'hashtags')
            .select([
                'article',
                'hashtags',
                '(article.viewCount + article.commentCount * 4 + article.likeCount * 2) AS score',
            ]).where('article.isPublic = true and article.deleted = false')
            .groupBy('article.id, hashtags.id')
            .orderBy('score', 'DESC')
            .limit(3);

        if (hashtag) {
            queryBuilder.andWhere('hashtags.hashtagName = :hashtagName', { hashtagName: hashtag })
        }

        if (category) {
            queryBuilder.andWhere('category.categoryName = :categoryName', { categoryName: category })
        }

        return queryBuilder.getMany();
    }

    async checkUserLiked({ articleId, userId }) {
        return this.createQueryBuilder('article')
            .leftJoinAndSelect('article.likes', 'user')
            .where('article.id = :articleId', { articleId: articleId })
            .where('user.id = :userId', { userId: userId })
            .getOne();
    }

    async getDetailArticle({ id, role }) {
        const article = this.createQueryBuilder('article')
            .leftJoinAndSelect('article.category', 'category')
            .leftJoinAndSelect('category.parentCategory', 'parentCategory')
            .leftJoinAndSelect('article.hashtags', 'hashtags')
            .where('article.deleted = :deleted', { deleted: false })
            .where('article.id = :id', { id: id });

        if (role != RoleScope.ADMIN) {
            article.andWhere('article.isPublic = true',)
        }

        return article.getOne();
    }
}