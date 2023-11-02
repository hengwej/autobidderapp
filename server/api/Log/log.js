/**
 * log.js
 * 
 * This module provides a comprehensive logging solution using the winston library.
 * 
 * Features:
 * - Custom log levels: trace, debug, info, warn, error, fatal.
 * - File-based logging with separate files for each log level.
 * - Daily rotating file transport for archiving logs.
 * - A log wrapper function to ensure consistent metadata in logs.
 * 
 * Usage if want to directly access from this file:
 * const { log, createLogWrapper } = require('./log.js');
 * const logger = createLogWrapper({ userId: '12345' });
 * logger.info('This is an info log with user context.');
 * 
 * else use logMiddleware.js
 */

const winston = require('winston');
const { createLogger, format, transports, add } = winston;
const { combine, timestamp, printf } = format;
const fs = require('fs');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');
// const EncryptedTransport = require('./encryptedTransport');
const moment = require('moment');  // For formatting timestamps

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

// Logger instance creation with specified configurations.
const log = createLogger({
    exitOnError: false,  // Do not exit on handled exceptions
    levels: customLevels.levels,  // Custom log levels
    format: combine(
        timestamp({  
            format: () => moment().format('DD-MM-YYYY HH:mm:ss')  // Add timestamp to logs
        }), 
        // colorize(),  
        format.json()
    ),
    defaultMeta: { service: 'user-service' },  // Default metadata for logs
    transports: [  // Define multiple transports
        // File transport configurations for each log level
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
        new DailyRotateFile({  // Daily rotating file transport configuration
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

/**
 * Creates a log wrapper with a given context. This ensures that logs have consistent metadata.
 * @param {Object} context - The context to be added to the logs.
 * @returns {Object} - A logger object with methods for each log level.
 */
function createLogWrapper(context = {}) {
    return {
        trace: (message) => log.log('trace', { ...context, message: `${context.userId} - ${message}` }),
        debug: (message) => log.log('debug', { ...context, message: `${context.userId} - ${message}` }),
        info: (message) => log.log('info', { ...context, message: `${context.userId} - ${message}` }),
        warn: (message) => log.log('warn', { ...context, message: `${context.userId} - ${message}` }),
        error: (message) => log.log('error', { ...context, message: `${context.userId} - ${message}` }),
        fatal: (message) => log.log('fatal', { ...context, message: `${context.userId} - ${message}` }),
    };
}

// Export the logger and log wrapper function
module.exports = { log, createLogWrapper };
