class LibConfig {
  get swaggerConfig() {
    return {
      user: process.env.SWAGGER_USER || 'csaHBG2023',
      password: process.env.SWAGGER_PASSWORD || '12345678',
    };
  }

  get jwtConfig() {
    return {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME) || 86400,
      memberExpiresIn: parseInt(process.env.JWT_EXPIRATION_TIME_MEMBER),
    };
  }

}

export const libConfig = new LibConfig();
