// const crypto = require('crypto');
// const fs = require('fs');
// const { key, iv } = require('./encryptionUtil');


// // Function to decrypt text
// function decrypt(text, key, iv) {
//     const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
//     let decrypted = decipher.update(text, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// }

// // Read the encrypted log
// const encryptedLog = fs.readFileSync('./encrypted.log', 'utf8');

// // Decrypt the log
// const decryptedLog = decrypt(encryptedLog, key, iv);

// // Output the decrypted log
// console.log(decryptedLog);
