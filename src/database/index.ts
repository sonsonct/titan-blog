import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { appConfig } from '../configs/app.config';
import { TYPEORM_EX_CUSTOM_REPOSITORY } from 'src/modules/commons/typeorm-ex/typeorm-ex.decorator';

EntityManager.prototype.getCustomRepository = function <T>(repository: any): T {
  const entity = Reflect.getMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, repository);
  if (entity) {
    return new repository(entity, this, this.queryRunner);
  }
  return null;
};

@Module({
  imports: [TypeOrmModule.forRoot(appConfig.typeOrmConfig)],
})
export class DatabaseModule { }
