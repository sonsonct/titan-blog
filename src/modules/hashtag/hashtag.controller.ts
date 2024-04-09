import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HashtagService } from './hashtag.service';
@ApiTags('hashtag')
@Controller('hashtag')
export class HashtagController {
    constructor(
        private readonly hashtagService: HashtagService
    ) { }

    @ApiResponse({
        description: 'List hashtag success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'List hashtag' })
    @Get('')
    @HttpCode(HttpStatus.OK)
    async listHashtag(
    ) {
        return await this.hashtagService.getListHashtag();
    }
}
