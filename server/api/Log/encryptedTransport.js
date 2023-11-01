// // encryptedTransport.js
// const winston = require('winston');
// const { encrypt } = require('./encryptionUtil');

// class EncryptedTransport extends winston.Transport {
//     constructor(opts) {
//         super(opts);
//         this.filename = opts.filename;
//     }

//     log(info, callback) {
//         setImmediate(() => {
//             this.emit('logged', info);
//         });

//         const encryptedMessage = encrypt(info.message);
//         // Append encrypted log to file
//         require('fs').appendFile(this.filename, `${info.level}: ${encryptedMessage}\n`, callback);
//     }
// }

// module.exports = EncryptedTransport;
