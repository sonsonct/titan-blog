import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { ArticleRepository } from '../../repositories/article.repository';
import { UserRepository } from '../../repositories/user.repository';
import { HashtagRepository } from '../../repositories/hashtag.repository';
import { CommentService } from '../comment/comment.service';
import { CommentRepository } from '../../repositories/comment.repository';
import { NotificationRepository } from '../../repositories/notification.repository';
import { StatisticalRepository } from 'src/repositories/statistical.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { S3Service } from '../s3/s3.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ArticleRepository, UserRepository, HashtagRepository, CommentRepository, NotificationRepository, StatisticalRepository, CategoryRepository])],
  controllers: [ArticleController],
  providers: [ArticleService, CommentService, S3Service]
})
export class ArticleModule { }
