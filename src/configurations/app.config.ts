import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('config', () => {
  return {
    port: process.env.PORT,
  };
});
