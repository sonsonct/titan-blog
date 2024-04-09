import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { CommentRepository } from '../../repositories/comment.repository';
import { NotificationRepository } from '../../repositories/notification.repository';
import { ArticleRepository } from '../../repositories/article.repository';
import { UserRepository } from '../../repositories/user.repository';
import { StatisticalRepository } from 'src/repositories/statistical.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CommentRepository, NotificationRepository, ArticleRepository, UserRepository, StatisticalRepository])],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule { }
