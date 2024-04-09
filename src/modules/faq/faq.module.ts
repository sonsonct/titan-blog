import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { FaqRepository } from '../../repositories/faq.repository';
import { CategoryRepository } from '../../repositories/category.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([FaqRepository, CategoryRepository])],
  controllers: [FaqController],
  providers: [FaqService]
})
export class FaqModule { }
