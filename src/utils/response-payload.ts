import { ResponseCodeEnum } from "src/commons/enums";


export interface ResponsePayload<T> {
    statusCode: ResponseCodeEnum;
    message?: string;
    data?: T;
}
