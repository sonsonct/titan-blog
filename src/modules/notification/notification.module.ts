import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { NotificationRepository } from '../../repositories/notification.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([NotificationRepository])],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {
}
