import { CustomRepository } from "src/modules/commons/typeorm-ex/typeorm-ex.decorator";
import { TypeORMRepository } from "../database/typeorm.repository";
import { Otp } from "../database/entities/otp.entity";

@CustomRepository(Otp)
export class OtpRepository extends TypeORMRepository<Otp> {
}
