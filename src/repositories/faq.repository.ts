import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";
import { Faq } from "../database/entities/faq.entity";
import { TypeORMRepository } from "src/database/typeorm.repository";
import { ListFaqDto } from "../modules/faq/dto/list-faq.dto";
import { RoleScope } from "src/commons/enums";

@CustomRepository(Faq)
export class FaqRepository extends TypeORMRepository<Faq> {
    async listFaqDto(query: ListFaqDto) {
        const { category, role, searchKey, page, pageSize, sortField = 'id', sortType = -1 } = query;
        const queryBuilder = this.createQueryBuilder('faq')
            .select().leftJoinAndSelect('faq.category', 'category');

        if (role != RoleScope.ADMIN) {
            queryBuilder.andWhere('faq.isPublic=true')
        }

        if (category) {
            queryBuilder.andWhere('category.categoryName = :categoryName', { categoryName: category })
        }

        if (searchKey) {
            queryBuilder.andWhere("faq.question LIKE :searchKey OR faq.answer LIKE :searchKey OR category.categoryName LIKE :searchKey", { searchKey: `%${searchKey}%` })
        }

        queryBuilder.orderBy(`faq.${sortField}`, sortType > 0 ? 'ASC' : 'DESC');

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

    async detailFaq(id: number) {
        return this.createQueryBuilder('faq')
            .select().leftJoinAndSelect('faq.category', 'category')
            .where('faq.id =:id', { id: id })
            .getOne();
    }
}