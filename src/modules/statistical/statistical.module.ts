import { Module } from '@nestjs/common';
import { StatisticalController } from './statistical.controller';
import { StatisticalService } from './statistical.service';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { StatisticalRepository } from 'src/repositories/statistical.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([StatisticalRepository])],
  controllers: [StatisticalController],
  providers: [StatisticalService]
})
export class StatisticalModule { }
