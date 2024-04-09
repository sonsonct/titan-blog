import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";
import { Hashtag } from "../database/entities/hashtag.entity";
import { TypeORMRepository } from "src/database/typeorm.repository";

@CustomRepository(Hashtag)
export class HashtagRepository extends TypeORMRepository<Hashtag> {
    async deleteHashtag(articleId: number) {
        return await this.createQueryBuilder('hashtag')
            .leftJoinAndSelect('hashtag.articles', 'article_hashtag')
            .delete()
            .from('article_hashtag')
            .where('article_hashtag.articleId = :articleId', { articleId: articleId })
            .execute();
    }

    async getListHashtag() {
        return await this.createQueryBuilder('hashtag')
            .select([
                'hashtag.id',
                'hashtag.hashtagName',
            ])
            .getMany();
    }
}