import { SocialLogin } from "src/database/entities/social-login.entity";
import { TypeORMRepository } from "src/database/typeorm.repository";
import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";

@CustomRepository(SocialLogin)
export class SocialLoginRepository extends TypeORMRepository<SocialLogin> {
}