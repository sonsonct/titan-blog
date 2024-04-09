import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../repositories/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetListCategoryDto } from './dto/get-list-category.dto';
import { httpNotFound } from 'src/nest/exceptions/http-exception';
import { IsNull, Not } from 'typeorm';
import { ResponseBuilder } from 'src/utils/response-builder';
import { ResponseCodeEnum } from 'src/commons/enums';
import { ChangeOrderDto } from './dto/change-order.dto';

@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
    ) { }

    async createCategory(createCategoryDto: CreateCategoryDto) {
        if (createCategoryDto.parentId) {
            const parentCategory = await this.categoryRepository.findOneBy({ id: createCategoryDto.parentId, parentId: IsNull() });
            if (!parentCategory) {
                throw new httpNotFound("This category parent not found");
            }
        }

        const category = await this.categoryRepository.findOneBy({ categoryName: createCategoryDto.categoryName });

        if (category) {
            throw new httpNotFound("This category already exists, please enter another one");
        }

        const categoryInsert = await this.categoryRepository.insert(createCategoryDto);

        await this.categoryRepository.update({ id: categoryInsert.identifiers[0].id }, { order: categoryInsert.identifiers[0].id })

        return new ResponseBuilder(categoryInsert)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async updateCategory(id: number, updateCategoryDto: CreateCategoryDto) {
        await this.checkExitsCategory(id);

        const existedCategoryName = await this.categoryRepository.findOne({
            where: {
                categoryName: updateCategoryDto.categoryName,
                id: Not(id)
            }
        });

        if (existedCategoryName) {
            throw new httpNotFound("This category already exists, please enter another one");
        }

        const categoryUpdate = await this.categoryRepository.update(id, { categoryName: updateCategoryDto.categoryName });

        return new ResponseBuilder(categoryUpdate)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async deleteCategory(id: number) {
        const categoryDelete = await this.categoryRepository.delete({ id });

        return new ResponseBuilder(categoryDelete)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async getListCategory(query: GetListCategoryDto) {
        const categories = await this.categoryRepository.getListCategory(query);

        return new ResponseBuilder(categories)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async getListCategoryAdmin(query: GetListCategoryDto) {
        const categories = await this.categoryRepository.getListCategoryAdmin(query);

        return new ResponseBuilder(categories)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }


    async getAllCategory() {
        const categories = await this.categoryRepository.getAllCategory();

        return new ResponseBuilder(categories)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async getCategoryByParentId(parentId: number) {
        await this.checkExitsCategory(parentId);

        const categories = await this.categoryRepository.getCategoryByParentId(parentId);

        return new ResponseBuilder(categories)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async changeOrder(changeOrderDto: ChangeOrderDto) {
        const { categoryId1, categoryId2 } = changeOrderDto;

        const [category1, category2] = await Promise.all([
            await this.checkExitsCategory(categoryId1),
            await this.checkExitsCategory(categoryId2)
        ]);

        await Promise.all([
            this.categoryRepository.update({ id: category1.id }, { order: category2.order }),
            this.categoryRepository.update({ id: category2.id }, { order: category1.order })
        ]);

        return new ResponseBuilder()
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async checkExitsCategory(id: number) {
        const category = await this.categoryRepository.findOneBy({ id });

        if (!category) {
            throw new httpNotFound("CATEGORY_NOT_FOUND");
        }

        return category;
    }
}
