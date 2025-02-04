import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('config', () => {
  return {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'dev',
  };
});
