"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const { combine, timestamp, printf, colorize } = winston_1.format;
class LoggerHandler {
    constructor() {
        LoggerHandler._instance = winston_1.createLogger({
            format: combine(timestamp(), printf(({ level, message, timestamp }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            })),
            transports: [
                new winston_1.transports.Console({
                    level: 'silly',
                    eol: '\n',
                    format: combine(colorize({ all: true }))
                }),
                new winston_1.transports.File({
                    filename: 'log.log',
                    level: 'silly',
                    options: {
                        encoding: 'utf8',
                        flags: 'a'
                    }
                })
            ]
        });
        LoggerHandler._instance.error = (err) => {
            if (err instanceof Error) {
                LoggerHandler._instance.log({ level: 'error', message: `${err.stack || err}` });
            }
            else {
                LoggerHandler._instance.log({ level: 'error', message: err });
            }
            return LoggerHandler._instance;
        };
    }
    static get Instance() {
        if (this._instance)
            return this._instance;
        else {
            let loggerHandler = new this();
            return this.Instance;
        }
    }
}
const logger = LoggerHandler.Instance;
exports.logger = logger;
//# sourceMappingURL=logger.js.map