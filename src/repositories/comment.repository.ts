import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";
import { Comment } from "../database/entities/comment.entity";
import { TypeORMRepository } from "src/database/typeorm.repository";
import { ListCommentDto, ListSubCommentDto } from "../modules/comment/dto/find-comment.dto";

@CustomRepository(Comment)
export class CommentRepository extends TypeORMRepository<Comment> {
    async listComment(query: ListCommentDto) {
        const { cursor, pageSize, articleId } = query;
        const queryBuilder = this.createQueryBuilder('comment')
            .leftJoin("comment.article", "article")
            .loadRelationCountAndMap('comment.likeCount', 'comment.likes')
            .loadRelationCountAndMap('comment.subCommentCount', 'comment.subComments')
            .where("article.deleted = false")
            .where("comment.deleted = false")
            .where("comment.parentId IS NULL")
            .where("article.id = :articleId", { articleId: articleId })
            .orderBy('comment.id', "DESC");

        if (cursor) {
            queryBuilder.andWhere("comment.id < :cursor", { cursor });
        }

        return this.listCursor(queryBuilder, pageSize);
    }

    async listSubComment(query: ListSubCommentDto) {
        const { cursor, pageSize, parentId } = query;
        const queryBuilder = this.createQueryBuilder('comment')
            .leftJoin('comment.likes', 'likes')
            .loadRelationCountAndMap('comment.likeCount', 'comment.likes')
            .where('comment.parentId = :parentId', { parentId: parentId })
            .where('comment.deleted = false')
            .orderBy('comment.id', 'DESC')

        if (cursor) {
            queryBuilder.andWhere("comment.id < :cursor", { cursor });
        }

        return this.listCursor(queryBuilder, pageSize);
    }

    async checkLiked({ commentId, userId }) {

        return this.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.likes', 'user')
            .where('comment.id = :commentId', { commentId: commentId })
            .where('user.id = :userId', { userId: userId })
            .getOne();
    }
}