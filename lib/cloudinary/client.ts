import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY,
});

export { cloudinary };
