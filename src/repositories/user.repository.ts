import { TypeORMRepository } from '../database/typeorm.repository';
import { User } from '../database/entities/user.entity';
import { CustomRepository } from 'src/modules/commons/typeorm-ex/typeorm-ex.decorator';

@CustomRepository(User)
export class UserRepository extends TypeORMRepository<User> {
  async getUserInfo(id: number) {
    return await this.createQueryBuilder('user')
      .select(['user.username', 'user.email', 'user.avatar'])
      .where('user.id =:id', { id: id })
      .getOne()
  }
}
