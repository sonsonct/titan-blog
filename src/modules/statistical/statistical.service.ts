import { StatisticalRepository } from './../../repositories/statistical.repository';
import { Injectable } from '@nestjs/common';
import { StatisticalDto } from './dto/statistical.dto';
import { ResponseCodeEnum } from 'src/commons/enums';
import { ResponseBuilder } from 'src/utils/response-builder';

@Injectable()
export class StatisticalService {
    constructor(
        private readonly statisticalRepository: StatisticalRepository,

    ) { }

    async getStatistical(query: StatisticalDto) {
        const statistical = await this.statisticalRepository.getStatistical(query);

        return new ResponseBuilder(statistical)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }

    async getStatisticalFullMonth() {
        const statistical = await this.statisticalRepository.getStatisticalFullMonth();

        return new ResponseBuilder(statistical)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }
}
