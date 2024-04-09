export enum CommonStatus {
  IN_ACTIVE = '0',
  ACTIVE = '1',
}

export enum RoleScope {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserStatus {
  INACTIVE = -1,
  DELETE = 0,
  ACTIVE = 1,
  BLOCK = 2,
}

export enum NotificationType {
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  LIKE_COMMENT = "LIKE_COMMENT",
  REP_COMMENT = "REP_COMMENT",
}

export enum StatisticalType {
  LIKE = "LIKE",
  UNLIKE = "UNLIKE",
  DELETE_COMMENT = "DELETE_COMMENT",
  COMMENT = "COMMENT",
  LIKE_COMMENT = "LIKE_COMMENT",
  UNLIKE_COMMENT = "UNLIKE_COMMENT",
  REP_COMMENT = "REP_COMMENT",
  VIEW = "VIEW",
}

export enum FilterStatisticalType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum NotificationHideRead {
  HIDE_READ = 'HIDE_READ',
  READ = "READ",
}

export const ManageRoles = [
  RoleScope.ADMIN,
  RoleScope.USER,
];

export enum OtpType {
  FORGET_PASSWORD = 'forget_password',
  REGISTER = 'register',
}

export enum OtpStatus {
  CREATED = 0,
  OTP_USED = 1,
  CODE_USED = 2,
}


export enum SocialLoginName {
  FACEBOOK = "FACEBOOK_LOGIN",
  GOOGLE = "GOOGLE_LOGIN",
}


export enum S3_FOLDER {
  AVATARS = "avatars",
  IMAGES = "images",
  THUMBNAIL = "thumbnail",
}

export enum ResponseCodeEnum {
  SUCCESS = 200,
}

const CODE_MESSAGES = {
  SUCCESS: 'Success',
};

export const getMessage = (code: ResponseCodeEnum): string => {
  return CODE_MESSAGES[`${ResponseCodeEnum[code]}`];
};
