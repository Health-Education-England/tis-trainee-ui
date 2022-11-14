const config = {
  cognito: {
    REGION: import.meta.env.VITE_COGNITO_REGION,
    USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
    IDENTITY_POOL_ID: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID,
    USER_PASSWORD_AUTH: import.meta.env.VITE_COGNITO_USER_PASSWORD_AUTH
  }
};

export default config;
