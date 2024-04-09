import { CategoryRepository } from '../../repositories/category.repository';
import { CreateFaqDto } from './dto/create-faq.dto';
import { FaqRepository } from '../../repositories/faq.repository';
import { Injectable } from '@nestjs/common';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ListFaqDto } from './dto/list-faq.dto';
import { httpNotFound } from 'src/nest/exceptions/http-exception';
import { ResponseBuilder } from 'src/utils/response-builder';
import { ResponseCodeEnum } from 'src/commons/enums';

@Injectable()
export class FaqService {
    constructor(
        private readonly faqRepository: FaqRepository,
        private readonly categoryRepository: CategoryRepository,
    ) { }

    async createFaq(createFaqDto: CreateFaqDto) {
        await this.checkCategoryExists(createFaqDto.categoryId);

        const faqInsert = await this.faqRepository.insert(createFaqDto);

        return new ResponseBuilder(faqInsert)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async updateFaq(id: number, updateFaqDto: UpdateFaqDto) {
        await this.checkCategoryExists(updateFaqDto.categoryId);

        const faqUpdate = await this.faqRepository.update({
            id,
        }, updateFaqDto);

        return new ResponseBuilder(faqUpdate)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async deleteFaq(id: number) {
        const faqDelete = await this.faqRepository.delete({ id });

        return new ResponseBuilder(faqDelete)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async getListFaqDto(query: ListFaqDto) {
        return await this.faqRepository.listFaqDto(query);
    }

    async detailFaq(id: number) {
        const faq = await this.faqRepository.detailFaq(id);

        if (!faq) {
            throw new httpNotFound("FAQ_NOT_FOUND");
        }

        return new ResponseBuilder(faq)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async checkCategoryExists(id: number) {
        const category = await this.categoryRepository.findOneBy({ id });

        if (!category) {
            throw new httpNotFound("CATEGORY_NOT_FOUND");
        }

        return category;
    }
}
