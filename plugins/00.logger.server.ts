import { defineNuxtPlugin } from 'nuxt/app';
import winston from 'winston';

export default defineNuxtPlugin(() => {
  const logger = winston.createLogger({
    level: 'verbose',
    format: winston.format.combine(
      winston.format.printf((event) => {
        return `${JSON.stringify({ ...event, timestamp: new Date().toISOString() }, null, 4)}\n`;
      })
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'application.log' })
    ]
  });

  return {
    provide: {
      logger
    }
  };
});
