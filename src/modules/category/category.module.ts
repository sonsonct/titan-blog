import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { CategoryRepository } from '../../repositories/category.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CategoryRepository])],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule { }
