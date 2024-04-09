import { TypeOrmExModule } from './../commons/typeorm-ex/typeorm-ex.module';
import { Module } from '@nestjs/common';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { HashtagRepository } from '../../repositories/hashtag.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([HashtagRepository])],
  controllers: [HashtagController],
  providers: [HashtagService]
})
export class HashtagModule { }
