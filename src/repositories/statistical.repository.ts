import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";
import { TypeORMRepository } from "../database/typeorm.repository";
import { Statistical } from "src/database/entities/statistical.entity";
import { FilterStatisticalType, StatisticalType } from "src/commons/enums";
import { StatisticalDto } from "src/modules/statistical/dto/statistical.dto";
import { httpBadRequest } from "src/nest/exceptions/http-exception";
import * as moment from "moment";
import { getDate, getEndDateBy, getFirstDateBy } from "src/utils/date.util";

@CustomRepository(Statistical)
export class StatisticalRepository extends TypeORMRepository<Statistical> {
    async addStatistical(statisticalType: StatisticalType) {
        let statistical = await this.createQueryBuilder('statistical')
            .select()
            .where('date =:date', { date: getDate() })
            .getOne();

        let statisticalId = statistical?.id;

        if (!statisticalId) {
            const result = await this.insert({ date: getDate() });
            statisticalId = result.identifiers[0].id;
        }

        return await this.addStatisticalByType(statisticalType, statisticalId);
    }

    async getStatistical(query: StatisticalDto) {
        let firstDay;
        let endDay;

        if (!query.firstDay && query.endDate || new Date(query.firstDay) > new Date(query.endDate) || new Date(query.firstDay) > new Date(getDate())) {
            throw new httpBadRequest("start date > end date");
        }

        if (query.firstDay && !query.endDate) {
            firstDay = query.firstDay;
            endDay = getDate();
        }

        if (query.firstDay && query.endDate) {
            firstDay = query.firstDay;
            endDay = query.endDate;
        }

        switch (query.filter) {
            case FilterStatisticalType.DAILY:
                firstDay = endDay = getDate();
                break;
            case FilterStatisticalType.WEEKLY:
                firstDay = getFirstDateBy('week');
                endDay = getEndDateBy('week');
                break;
            case FilterStatisticalType.MONTHLY:
                firstDay = getFirstDateBy('month');
                endDay = getEndDateBy('month');
                break;
            case FilterStatisticalType.YEARLY:
                firstDay = getFirstDateBy('year');
                endDay = getEndDateBy('year');
                break;
            default:
                break;
        }

        const statistical = await this.getStatisticalByDate(firstDay, endDay);

        return statistical.likeCount != null ? statistical : {
            likeCount: 0,
            viewCount: 0,
            commentCount: 0
        };
    }


    async getStatisticalFullMonth() {
        let statistical = [];
        const firstDay = getFirstDateBy('month');
        const endDay = getEndDateBy('month');
        const endDayOfMonth = moment().endOf('month').format('DD');
        const getStatistical = await this.createQueryBuilder('statistical')
            .select()
            .where('statistical.date BETWEEN :startDate AND :endDate', {
                startDate: firstDay,
                endDate: endDay
            }).getMany();

        for (let i = 1; i <= parseInt(endDayOfMonth); i++) {
            const day = (i < 10) ? "0" + i : i;
            const fullDay = moment().format('YYYY-MM') + "-" + day;

            const data = getStatistical.find(item => item.date.toString() === fullDay);

            if (data) {
                statistical.push({
                    date: fullDay,
                    viewCount: data.viewCount,
                    likeCount: data.likeCount,
                    commentCount: data.commentCount
                });
            } else {
                statistical.push({
                    date: fullDay,
                    viewCount: 0,
                    likeCount: 0,
                    commentCount: 0
                });
            }
        }

        return statistical;
    }

    async getStatisticalByDate(firstDay: Date | string, endDay: Date | string) {
        return await this.createQueryBuilder('statistical')
            .select('SUM(statistical.likeCount)', 'likeCount')
            .addSelect('SUM(statistical.commentCount)', 'commentCount')
            .addSelect('SUM(statistical.viewCount)', 'viewCount')
            .where('statistical.date BETWEEN :startDate AND :endDate', {
                startDate: firstDay,
                endDate: endDay
            })
            .getRawOne();
    }

    async addStatisticalByType(statisticalType: StatisticalType, statisticalId: number) {
        const queryBuilder = this.createQueryBuilder('statistical')
            .update()
            .where('id =:statisticalId', { statisticalId: statisticalId });

        switch (statisticalType) {
            case StatisticalType.COMMENT:
                queryBuilder.set({ commentCount: () => 'commentCount + 1' })
                break;
            case StatisticalType.REP_COMMENT:
                queryBuilder.set({ commentCount: () => 'commentCount + 1' })
                break;
            case StatisticalType.DELETE_COMMENT:
                queryBuilder.set({ commentCount: () => 'commentCount - 1' }).andWhere('commentCount > 0')
                break;
            case StatisticalType.LIKE_COMMENT:
                queryBuilder.set({ likeCount: () => 'likeCount + 1' })
                break;
            case StatisticalType.LIKE:
                queryBuilder.set({ likeCount: () => 'likeCount + 1' })
                break;
            case StatisticalType.UNLIKE_COMMENT:
                queryBuilder.set({ likeCount: () => 'likeCount - 1' }).andWhere('likeCount > 0')
                break;
            case StatisticalType.UNLIKE:
                queryBuilder.set({ likeCount: () => 'likeCount - 1' }).andWhere('likeCount > 0')
                break;
            case StatisticalType.VIEW:
                queryBuilder.set({ viewCount: () => 'viewCount + 1' })
                break;
            default:
                break;
        }

        return queryBuilder.execute();
    }
}
