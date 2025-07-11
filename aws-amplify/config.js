const config = {
  REGION: process.env.NEXT_PUBLIC_COGNITO_REGION,
  USER_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  APP_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID,
  IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
  USER_PASSWORD_AUTH: process.env.NEXT_PUBLIC_COGNITO_USER_PASSWORD_AUTH
};

export default config;
