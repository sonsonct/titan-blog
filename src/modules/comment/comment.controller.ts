import { CommentService } from './comment.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Request } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto, CreateReplyCommentDto } from './dto/create-comment.dto';
import { ListCommentDto, ListSubCommentDto } from './dto/find-comment.dto';
import { ManageRoles } from 'src/commons/enums';
import { CommentUserLikesDto } from './dto/create-likes-comment.dto';
import { SetRoles } from 'src/nest/decorators/set-roles.decorator';
import { ApplyAuthGuard } from 'src/nest/guards/auth.guard';
@ApiTags("comments")
@Controller('comments')
export class CommentController {
    constructor(
        private readonly commentService: CommentService
    ) { }

    @ApiResponse({
        description: 'Create comment success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Create comment' })
    @ApiBody({ type: CreateCommentDto })
    @ApplyAuthGuard()
    @SetRoles(...ManageRoles)
    @Post('')
    @HttpCode(HttpStatus.OK)
    async createComment(
        @Body() createCommentDto: CreateCommentDto,
        @Request() req
    ) {
        createCommentDto.userId = req.user.id;
        return await this.commentService.createComment(createCommentDto);
    }

    @ApiResponse({
        description: 'Create rep comment success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Create rep comment' })
    @ApiBody({ type: CreateReplyCommentDto })
    @ApplyAuthGuard()
    @SetRoles(...ManageRoles)
    @Post('reply/')
    @HttpCode(HttpStatus.OK)
    async replyComment(
        @Body() createReplyCommentDto: CreateReplyCommentDto,
        @Request() req
    ) {
        createReplyCommentDto.userId = req.user.id;
        return await this.commentService.repComment(createReplyCommentDto);
    }

    @ApiResponse({
        description: 'Get list comment success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'List comment' })
    @Get('/:articleId/')
    @HttpCode(HttpStatus.OK)
    async listComment(
        @Param('articleId') articleId: number,
        @Query() listCommentDto: ListCommentDto,
    ) {
        listCommentDto.articleId = articleId;
        return await this.commentService.getListComment(listCommentDto);
    }

    @ApiResponse({
        description: 'Get list sub comment success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'List sub comment' })
    @Get('/reply/:parentId')
    @HttpCode(HttpStatus.OK)
    async listSubComment(
        @Param('parentId') parentId: number,
        @Query() listSubCommentDto: ListSubCommentDto,
    ) {
        listSubCommentDto.parentId = parentId;
        return await this.commentService.getListSubComment(listSubCommentDto);
    }

    @ApiResponse({
        description: 'Delete comment success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Delete comment' })
    @ApplyAuthGuard()
    @SetRoles(...ManageRoles)
    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async deleteComment(
        @Param("id") id: number,
        @Request() req
    ) {
        return await this.commentService.deleteComment(id, req);
    }

    @ApiResponse({
        description: 'Like comment success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Like comment' })
    @ApplyAuthGuard()
    @SetRoles(...ManageRoles)
    @Post('/like/:id')
    @HttpCode(HttpStatus.OK)
    async likeComment(
        @Param('id') id: number,
        @Request() req
    ) {
        const commentUserLikesDto = new CommentUserLikesDto;
        commentUserLikesDto.commentId = id;
        commentUserLikesDto.userId = +req.user.id;

        return await this.commentService.likeComment(commentUserLikesDto);
    }
}
