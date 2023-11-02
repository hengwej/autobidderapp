const winston = require('winston');
const { createLogger, format, transports, add } = winston;
const { combine, timestamp, printf } = format;
const fs = require('fs');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');
// const EncryptedTransport = require('./encryptedTransport');
const moment = require('moment');

// Determine the directory path dynamically
const logDir = path.join(__dirname, 'logs');

// Ensure the log directory exists, if not create it
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Define custom log levels
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

// Function to ignore EPIPE errors
function ignoreEpipe(err) {
    return err.code !== 'EPIPE';
}

// Create the logger instance
const log = createLogger({
    exitOnError: false,  // Do not exit on handled exceptions
    exitOnError: ignoreEpipe,  // Custom error handler
    levels: customLevels.levels,  // Custom log levels
    format: combine(
        timestamp(),   // Add timestamp to logs
        // colorize(),
        printf(info => `${moment(info.timestamp).format('DD-MM-YYYY HH:mm:ss')} ${info.level}: ${info.message}`)  // Customize log format and timestamp format
        // printf(info => `${info.timestamp} ${info.level}: ${info.message}`)  // Customize log format
    ),
    defaultMeta: { service: 'user-service' },  // Default metadata
    transports: [  // Define multiple transports
        // new EncryptedTransport({ filename: path.join(logDir, 'encrypted.log') }),
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
    rejectionHandlers: [  // Handle unhandled promise rejections
        new transports.File({
            filename: path.join(logDir, 'rejections.log')
        })
    ]
});

// Create a log wrapper function to include accountID in logs
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

// Export the logger and log wrapper function
module.exports = { log, createLogWrapper };
