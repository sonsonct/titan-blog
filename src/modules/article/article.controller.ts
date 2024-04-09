import { Body, Controller, Delete, FileTypeValidator, Get, HttpCode, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetListArticleDto } from './dto/list-article.dto';
import { ManageRoles, RoleScope } from 'src/commons/enums';
import { ArticleUserLikesDto } from './dto/create-likes-article.dto';
import { SetRoles } from 'src/nest/decorators/set-roles.decorator';
import { ApplyAuthGuard } from 'src/nest/guards/auth.guard';
import { Multer } from "multer"

@ApiTags('articles')
@Controller('articles')
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
    ) { }

    @ApiResponse({
        description: 'Create article success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Create article' })
    @ApiBody({ type: CreateArticleDto })
    @UseInterceptors(FileInterceptor('thumbnail'))
    @ApplyAuthGuard()
    @SetRoles(RoleScope.ADMIN)
    @Post('')
    @HttpCode(HttpStatus.OK)
    async createArticle(
        @Body() createArticleDto: CreateArticleDto,
        @UploadedFile(new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg|mp4)' }),
            ],
        })) thumbnail: Express.Multer.File,
        @Request() req
    ) {
        createArticleDto.authorId = req.user.id;

        return await this.articleService.createArticle(createArticleDto, thumbnail);
    }

    @ApiResponse({
        description: 'Update article success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Update article' })
    @ApiBody({ type: UpdateArticleDto })
    @UseInterceptors(FileInterceptor('thumbnail'))
    @ApplyAuthGuard()
    @SetRoles(RoleScope.ADMIN)
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateArticle(
        @Param("id") id: number,
        @Body() updateArticleDto: UpdateArticleDto,
        @UploadedFile() thumbnail: Express.Multer.File,
    ) {
        return await this.articleService.updateArticle(id, updateArticleDto, thumbnail);
    }

    @ApiResponse({
        description: 'Delete article success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Delete article' })
    @ApplyAuthGuard()
    @SetRoles(RoleScope.ADMIN)
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteArticle(
        @Param("id") id: number,
    ) {
        return await this.articleService.deleteArticle(id);
    }

    @ApiResponse({
        description: 'Get list hot article success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Get list hot article' })
    @Get('/hot')
    @HttpCode(HttpStatus.OK)
    async getListHotArticle(
        @Query() query: GetListArticleDto,
    ) {
        return await this.articleService.getListHotArticle(query);
    }

    @ApiResponse({
        description: 'get list article success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'get list article' })
    @ApplyAuthGuard()
    @SetRoles(RoleScope.ADMIN)
    @Get('/admin')
    @HttpCode(HttpStatus.OK)
    async getListArticleAdmin(
        @Query() query: GetListArticleDto,
        @Request() req
    ) {
        query.role = req.user?.role;
        return await this.articleService.getListArticle(query);
    }

    @ApiResponse({
        description: 'Get detail article success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Detail article' })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getArticle(
        @Param('id') id: number,
    ) {
        return await this.articleService.getArticle({
            id,
            role: null
        });
    }

    @ApiResponse({
        description: 'Get detail article admin success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Detail article admin' })
    @ApplyAuthGuard()
    @SetRoles(RoleScope.ADMIN)
    @Get(':id/admin')
    @HttpCode(HttpStatus.OK)
    async getArticleAdmin(
        @Param('id') id: number,
        @Request() req,
    ) {
        return await this.articleService.getArticle({
            id,
            role: req.user.role
        });
    }

    @ApiResponse({
        description: 'get list article success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'get list article' })
    @Get('')
    @HttpCode(HttpStatus.OK)
    async getListArticle(
        @Query() query: GetListArticleDto,
        @Request() req
    ) {
        query.role = req.user?.role;

        return await this.articleService.getListArticle(query);
    }

    @ApiResponse({
        description: 'Like article success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Like article' })
    @ApplyAuthGuard()
    @SetRoles(...ManageRoles)
    @Post('/like/:id')
    @HttpCode(HttpStatus.OK)
    async likeArticle(
        @Param('id') id: number,
        @Request() req
    ) {
        const articleUserLikesDto = new ArticleUserLikesDto;

        articleUserLikesDto.articleId = id;
        articleUserLikesDto.userId = +req.user.id;

        return await this.articleService.likeArticle(articleUserLikesDto);
    }

    @ApiResponse({
        description: 'Upload file success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Upload file' })
    @UseInterceptors(FileInterceptor('file'))
    @ApplyAuthGuard()
    @SetRoles(RoleScope.ADMIN)
    @Post('/upload/S3')
    @HttpCode(HttpStatus.OK)
    async uploadFileS3(
        @UploadedFile(new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg|mp4)' }),
            ],
        })) file: Express.Multer.File,
    ) {
        return await this.articleService.uploadFileS3(file);
    }
}
