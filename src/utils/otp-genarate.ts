import { appConfig } from "src/configs/app.config";
import { CryptoUtil } from "./crypto.util";
import { httpBadRequest } from "src/nest/exceptions/http-exception";

export const randomNumber = async (min: number, max: number): Promise<any> => {
    const number = Math.floor(Math.random() * (max - min)) + Math.floor(min);
    return number;
}

export const encryptSignature = (otpDetails: any) => {
    return CryptoUtil.encryptString(JSON.stringify(otpDetails), appConfig.encryptKey.appKey);
}

export const decryptSignature = (signature: string) => {
    try {
        const decoded = JSON.parse(CryptoUtil.decryptString(signature, appConfig.encryptKey.appKey));

        return decoded;
    } catch (ex) {
        throw new httpBadRequest("INVALID_VERIFICATION_KEY");
    }
}