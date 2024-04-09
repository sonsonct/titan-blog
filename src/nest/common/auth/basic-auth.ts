import * as jwt from 'jsonwebtoken';
import { pick, omitBy, isNil } from 'lodash';
import { libConfig } from '../../config/lib.config';

export type TokenPayloadModel = {
  id: string;
  role: string;
  email?: string;
  // end
  iat: number;
  exp: number;
};

const tokenAttributes = ['id', 'role'];

export function checkTokenPayload(object: any) {
  return tokenAttributes.every((x) => x in object);
}

export class BasicAuth {
  public static verifyToken(token: string) {
    return jwt.verify(token, libConfig.jwtConfig.secret, {
      algorithms: ['HS512'],
    }) as TokenPayloadModel;
  }

  public static signToken(
    user: any,
    expiresIn: number = libConfig.jwtConfig.expiresIn,
    fields: string[] = [...tokenAttributes],
  ) {
    return jwt.sign(pick(omitBy(user, isNil), fields), libConfig.jwtConfig.secret, {
      algorithm: 'HS512',
      expiresIn: expiresIn,
    });
  }

}
