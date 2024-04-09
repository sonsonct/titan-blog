import {
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

// 400
export function httpBadRequest(message?: string, code?: string) {
    throw new BadRequestException({
        statusCode: 400,
        errorCode: code ?? null,
        message,
    });
}

// 401
export function httpUnAuthorized(message?: string) {
    throw new UnauthorizedException(message);
}

// 403
export function httpForbidden(message?: string) {
    throw new ForbiddenException(message);
}

// 404
export function httpNotFound(message?: string) {
    throw new NotFoundException(message);
}

// 500
export function httpInternalServerErrorException(message?: string) {
    throw new InternalServerErrorException(message);
}