import crypto from 'crypto';
import { ENCRYPTION_SECRET } from '../configs/env.js';

const algorithm = 'aes-256-ctr';
const key = crypto.scryptSync(ENCRYPTION_SECRET, 'salt', 32); // derive a 32-byte key

// Encrypt the message
export const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

// Decrypt the message
export const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(hash.iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(hash.encryptedData, 'hex'), 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}