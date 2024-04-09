export class LibConst {
  static readonly ENVIRONMENT = {
    PRODUCTION: 'production',
    STAGING: 'staging',
    DEVELOPMENT: 'dev',
    LOCAL: 'local',
  };

  static readonly BOOLEAN: any = {
    TRUE: 'true',
    FALSE: 'false',
  };

  static readonly API_PREFIX: string = 'api';
  static readonly API_VERSION: string = 'v1';

  static readonly INTERNAL_HTTP_HEADER_KEY = 'x-csa-internal-secret';

  static readonly PAGE_NUMBER: number = 1;
  static readonly PAGE_SIZE: number = 20;
  static readonly ROUTE_DEFAULT: string = 'route_default';
}
