import {
  Repository,
  ObjectLiteral,
  SelectQueryBuilder,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { IPaginationTypeOrmModel, IPaginateTypeOrmParams } from './pagination.interface';
import { AppConst } from '../commons/consts/app.const';
import { ResponseCodeEnum } from 'src/commons/enums';

export class TypeORMRepository<T extends ObjectLiteral> extends Repository<T> {
  public async list(
    { page = AppConst.PAGE_NUMBER, limit = AppConst.PAGE_SIZE },
    query: IPaginateTypeOrmParams<T>,
  ): Promise<IPaginationTypeOrmModel<T>> {
    if (limit < 0) {
      limit = 0;
    }

    const options = {
      page: page,
      limit: limit,
    };

    let results: any;

    if (query.advanceConditions?.createdAtFrom) {
      query.queryBuilder.andWhere(`${query.queryBuilder.alias}.createdAt >= :createdAtFrom`, {
        createdAtFrom: new Date(query.advanceConditions?.createdAtFrom),
      });
    }

    if (query.advanceConditions?.createdAtTo) {
      query.queryBuilder.andWhere(`${query.queryBuilder.alias}.createdAt <= :createdAtTo`, {
        createdAtTo: new Date(query.advanceConditions?.createdAtTo),
      });
    }

    // Check query.sort
    if (query.sort) {
      const sortValues: string[] = query.sort.split(';');
      sortValues.forEach((sv: string) => {
        const value: string[] = sv.split(':');
        if (value[0].includes('.')) {
          query.queryBuilder.addOrderBy(value[0], Number(value[1]) === 1 ? 'ASC' : 'DESC');
        } else {
          query.queryBuilder.addOrderBy(
            `${query.queryBuilder.alias}.${value[0]}`,
            Number(value[1]) === 1 ? 'ASC' : 'DESC',
          );
        }
      });
    }

    if (options.limit === 0) {
      const items = await this.getManyQB(query.queryBuilder);
      results = {
        items,
        meta: {
          currentPage: options.page,
          itemsPerPage: 0,
          totalItems: items.length,
          totalPages: null,
        },
      };
    } else {
      query.queryBuilder.take(limit);
      query.queryBuilder.skip((page - 1) * limit);
      const data = await query.queryBuilder.getManyAndCount();
      results = {
        items: data[0],
        meta: {
          currentPage: page,
          itemsPerPage: limit,
          totalPages: Math.ceil(data[1] / limit),
          totalItems: data[1],
        },
      };
    }

    return {
      data: results.items,
      page: results.meta.currentPage,
      pageSize: results.meta.itemsPerPage,
      totalPage: results.meta.totalPages,
      totalItem: results.meta.totalItems,
      statusCode: ResponseCodeEnum.SUCCESS,
      messages: "Get list successfully"
    } as IPaginationTypeOrmModel<T>;
  }

  public async listCursor(
    queryBuilder: any,
    pageSize: number,
  ) {
    const data = await queryBuilder
      .limit(pageSize)
      .getMany();

    let afterCursor = null;
    let nextCursor = null;

    if (data?.length > 0) {
      nextCursor = data[data?.length - 1]?.id;
      afterCursor = data[0]?.id;
    }

    return {
      data,
      afterCursor,
      nextCursor,
      statusCode: ResponseCodeEnum.SUCCESS,
      messages: "Get list successfully"
    };
  }

  public async detailById(id: number | string, options: FindOneOptions<T> = {}) {
    options.where = { id } as unknown as FindOptionsWhere<T>;

    return this.findOne(options);
  }

  public async getManyQB(queryBuilder: SelectQueryBuilder<T>) {
    return queryBuilder.getMany();
  }
}
