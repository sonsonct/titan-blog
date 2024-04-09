import { Injectable } from '@nestjs/common';
import { HashtagRepository } from '../../repositories/hashtag.repository';
import { ResponseBuilder } from 'src/utils/response-builder';
import { ResponseCodeEnum } from 'src/commons/enums';

@Injectable()
export class HashtagService {
    constructor(
        private readonly hashtagRepository: HashtagRepository,
    ) { }

    async getListHashtag() {
        const listHashtag = await this.hashtagRepository.getListHashtag();

        return new ResponseBuilder(listHashtag)
            .withCode(ResponseCodeEnum.SUCCESS)
            .build();
    }
}
