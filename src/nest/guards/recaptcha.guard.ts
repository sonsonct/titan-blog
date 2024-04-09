import {
    Injectable,
    CanActivate,
    ExecutionContext,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { httpBadRequest } from "../exceptions/http-exception";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecaptchaGuard implements CanActivate {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { body } = context.switchToHttp().getRequest();

        const { data } = await firstValueFrom(this.httpService
            .post(
                `https://www.google.com/recaptcha/api/siteverify?response=${body['g-recaptcha-response']}&secret=${this.configService.get("RECAPTCHA_SECRET")}`
            )
        );

        if (!data.success) {
            throw new httpBadRequest("RECAPTCHA_INVALID");
        }

        return true;
    }
}