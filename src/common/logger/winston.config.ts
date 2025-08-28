import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors, align, splat } = winston.format;

// 控制台日志格式
const consoleFormat = printf(({ level, message, timestamp, stack, context, ...meta }) => {
  const contextStr = context ? `\x1b[36m[${context}]\x1b[0m ` : '';
  const timestampStr = `\x1b[90m${timestamp}\x1b[0m`;
  const stackStr = stack ? `\n\x1b[31m${stack}\x1b[0m` : '';
  const metaStr = Object.keys(meta).length
    ? `\n\x1b[90m${JSON.stringify(meta, null, 2)}\x1b[0m`
    : '';

  return `${timestampStr} ${level} ${contextStr}${message}${stackStr}${metaStr}`;
});

// 文件日志格式
const fileFormat = printf(({ level, message, timestamp, stack, context, ...meta }) => {
  const contextStr = context ? `[${context}] ` : '';
  const stackStr = stack ? `\n${stack}` : '';
  const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';

  return `${timestamp} [${level.toUpperCase()}] ${contextStr}${message}${stackStr}${metaStr}`;
});

// 日志目录
const logDir = 'logs';

// 自定义颜色配置
const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
  verbose: 'cyan',
};

winston.addColors(customColors);

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    // 控制台输出 - 带颜色和美化格式
    new winston.transports.Console({
      format: combine(
        colorize({ all: true, colors: customColors }),
        timestamp({ format: 'HH:mm:ss' }),
        align(),
        errors({ stack: true }),
        splat(),
        consoleFormat,
      ),
    }),

    // 错误日志文件 - 按日期轮转
    new winston.transports.DailyRotateFile({
      filename: `${logDir}/error-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        splat(),
        fileFormat,
      ),
    }),

    // 所有日志文件 - 按日期轮转
    new winston.transports.DailyRotateFile({
      filename: `${logDir}/application-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        splat(),
        fileFormat,
      ),
    }),
  ],
  // 设置默认日志级别
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
};
