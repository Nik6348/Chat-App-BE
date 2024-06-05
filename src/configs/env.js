// Exporting the environment variables
import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;

export const DB_URI = process.env.MONGODB_URI;

export const JWT_SECRET = process.env.JWT_SECRET;

export const JWT_EXPIRE = Number(process.env.JWT_EXPIRES_IN)

// encription decription
export const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
