import { defineNuxtPlugin } from 'nuxt/app';
import winston from 'winston';

export default defineNuxtPlugin(() => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.printf((event) => {
        return `${JSON.stringify({ ...event, timestamp: new Date().toISOString() }, null, 4)}\n`;
      })
    ),
    defaultMeta: { service: 'nature-nas' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple()
      })
    );
  }

  return {
    provide: {
      logger
    }
  };
});
