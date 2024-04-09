import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Request } from '@nestjs/common';
import { FaqService } from './faq.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ListFaqDto } from './dto/list-faq.dto';
import { RoleScope } from 'src/commons/enums';
import { SetRoles } from 'src/nest/decorators/set-roles.decorator';
import { ApplyAuthGuard } from 'src/nest/guards/auth.guard';


@ApiTags("faqs")
@Controller('faqs')
export class FaqController {
    constructor(
        private readonly faqService: FaqService,
    ) { }

    @ApiResponse({
        description: 'Create faq success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Create faq' })
    @ApiBody({ type: CreateFaqDto })
    @ApplyAuthGuard()
    @SetRoles(RoleScope.ADMIN)
    @Post('')
    @HttpCode(HttpStatus.OK)
    async createFaq(
        @Body() createFaqDto: CreateFaqDto,
        @Request() req
    ) {
        createFaqDto.authorId = req.user.id;
        return await this.faqService.createFaq(createFaqDto);
    }

    @ApiResponse({
        description: 'Update faq success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Update faq' })
    @ApiBody({ type: UpdateFaqDto })
    @ApplyAuthGuard()
    @SetRoles(RoleScope.ADMIN)
    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    async updateFaq(
        @Param('id') id: number,
        @Body() updateFaqDto: UpdateFaqDto,
    ) {
        return await this.faqService.updateFaq(id, updateFaqDto);
    }

    @ApiResponse({
        description: 'Delete faq success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Delete faq' })
    @ApplyAuthGuard()
    @SetRoles(RoleScope.ADMIN)
    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async deleteFaq(
        @Param('id') id: number,
    ) {
        return await this.faqService.deleteFaq(id);
    }

    @ApiResponse({
        description: 'List faq success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'List faq' })
    @ApplyAuthGuard()
    @SetRoles(RoleScope.ADMIN)
    @Get('/admin')
    @HttpCode(HttpStatus.OK)
    async listFaqAdmin(
        @Query() query: ListFaqDto,
        @Request() req
    ) {
        query.role = req.user?.role;
        return await this.faqService.getListFaqDto(query);
    }

    @ApiResponse({
        description: 'List faq success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'List faq' })
    @Get('')
    @HttpCode(HttpStatus.OK)
    async listFaq(
        @Query() query: ListFaqDto,
    ) {
        return await this.faqService.getListFaqDto(query);
    }

    @ApiResponse({
        description: 'Detail faq success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Detail faq' })
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async detailFaq(
        @Param('id') id: number,
    ) {
        return await this.faqService.detailFaq(id);
    }
}
