const winston = require('winston');
const { createLogger, format, transports, add } = winston;
const { combine, timestamp, printf } = format;
const fs = require('fs');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');

// Determine the directory path dynamically
const logDir = path.join(__dirname, 'logs');

// Ensure the log directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const customLevels = {
    levels: {
        trace: 6,
        debug: 5,
        info: 4,
        warn: 3,
        error: 2,
        fatal: 1
    },
    // not using color for neater textfile
    // colors: {
    //     trace: 'blue',
    //     debug: 'white',
    //     info: 'green',
    //     warn: 'yellow',
    //     error: 'orange',
    //     fatal: 'red',
    // }
};
// addColors(customLevels.colors);

function ignoreEpipe(err) {
    return err.code !== 'EPIPE';
}

const log = createLogger({
    exitOnError: false,
    exitOnError: ignoreEpipe,
    levels: customLevels.levels,
    format: combine(
        timestamp(),
        // colorize(),
        printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.Console(),
        new transports.File({
            filename: path.join(logDir, 'combined.log')
        }),
        new transports.File({
            filename: path.join(logDir, 'trace.log'),
            level: 'trace',
            handleExceptions: true
        }),
        new transports.File({
            filename: path.join(logDir, 'debug.log'),
            level: 'debug',
            handleExceptions: true
        }),
        new transports.File({
            filename: path.join(logDir, 'info.log'),
            level: 'info',
            handleExceptions: true
        }),
        new transports.File({
            filename: path.join(logDir, 'warn.log'),
            level: 'warn',
            handleExceptions: true
        }),
        new transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            handleExceptions: true
        }),
        new transports.File({
            filename: path.join(logDir, 'fatal.log'),
            level: 'fatal',
            handleExceptions: true
        }),
        new DailyRotateFile({
            filename: path.join(logDir, 'archive', 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '100m',
            maxFiles: '14d',
        }),
    ],
    rejectionHandlers: [
        new transports.File({
            filename: path.join(logDir, 'rejections.log')
        })
    ]
});

function createLogWrapper(accountID = "Guest") {
    return {
        trace: (message) => log.log('trace', `Account ID: ${accountID}. Message -> ${message}`),
        debug: (message) => log.log('debug', `Account ID: ${accountID}. Message -> ${message}`),
        info: (message) => log.log('info', `Account ID: ${accountID}. Message -> ${message}`),
        warn: (message) => log.log('warn', `Account ID: ${accountID}. Message -> ${message}`),
        error: (message) => log.log('error', `Account ID: ${accountID}. Message -> ${message}`),
        fatal: (message) => log.log('fatal', `Account ID: ${accountID}. Message -> ${message}`),
    };
}

module.exports = { log, createLogWrapper };
