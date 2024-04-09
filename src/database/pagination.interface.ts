import { SelectQueryBuilder } from 'typeorm';

export interface IPaginationTypeOrmModel<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  // cursor paging
  next?: string;
  hashNext?: boolean;
  previous?: string;
  hashPrevious?: boolean;
  metadata?: any;
}

export interface IPaginateTypeOrmParams<T> {
  /**
   * @field relations
   * @type array string
   * @description get relations with other table, and use for typeorm
   * @example relations: ['relation']
   */
  relations?: string[];

  /**
   * @field queryBuilder
   * @type array string
   * @description get queryBuilder with other table, and use for typeorm
   * @example queryBuilder: ['queryBuilder']
   *
   */
  queryBuilder?: SelectQueryBuilder<T>;

  /**
   * @field relations
   * @type array string
   * @description get relations with other table, and use for typeorm
   * @example relations: ['relation']
   */
  advanceConditions?: any;

  /**
   * @field page
   * @type number
   * @description set current page
   * @example page:2
   */
  page?: number;

  /**
   * @field page_size
   * @type number
   * @description size page request.
   * * Default is 20
   * * If page_size=-1 <=> get all data
   * @example page_size=20
   */
  pageSize?: number;
  /**
   * @field sort
   * @type string
   * @description sort param
   * @example sort: _id:1;name:1;address:-1
   */
  sort?: string;
  /**
   * @field select
   * @type string
   * @description list field is preview
   * @example select: name:0;email:1,
   */
  select?: string;
  /**
   * @field populations
   * @type string
   * @description mongoose populate. We are support populate with field select
   * @example populations: account:name address  (<=> populate field "account" and show list with field "name" & "address")
   */
  populations?: string;
  /**
   * @field where
   * @type string
   * @description search for absolute right data
   * @example where: role:wholesaler;status.active.is_active:1,
   */
  where?: string;
  /**
   * @field pattern
   * @type string
   * @description search for same like SQL
   * @example email:manhhipkhmt2
   */
  pattern?: string;
  /**
   * @field content
   * @type string
   * @description full text search
   * @example duytmx
   */
  content?: string;
}
