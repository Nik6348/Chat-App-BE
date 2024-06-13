// Exporting the environment variables
import dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT || 3000;

export const DB_URI = process.env.MONGODB_URI;

export const JWT_SECRET = process.env.JWT_SECRET;

export const JWT_EXPIRE = Number(process.env.JWT_EXPIRES_IN)

// encription decription
export const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;


// AWS S3 bucket details
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_REGION = process.env.AWS_REGION;