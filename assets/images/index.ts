/**
 * Image Assets Registry
 * Import and export all images from this folder for easy access throughout the app
 * Usage: import { IMAGES } from '@/assets/images'; then access images via IMAGES.FRAME_NAME
 */

import Frame2147235238 from './Frame 2147235238.png';
import Frame2147235239 from './Frame 2147235239.jpg';
import Frame2147235240 from './Frame 2147235240.png';
import Frame2147235241 from './Frame 2147235241.jpg';
import Frame2147235244 from './Frame 2147235244.png';
import Frame2147235245 from './Frame 2147235245.png';
import Frame2147235246 from './Frame 2147235246.png';
import Frame21472352501 from './Frame 2147235250 (1).jpg';
import Frame21472352502 from './Frame 2147235250 (2).jpg';
import Frame2147235250 from './Frame 2147235250.jpg';
import Frame2147235257 from './Frame 2147235257.png';
import Frame2147235258 from './Frame 2147235258.png';
import Frame2147235259 from './Frame 2147235259.png';
import Frame2147235260 from './Frame 2147235260.png';
import Frame2147235565 from './Frame 2147235565.png';
import HeartImage from './Heart.png';

/**
 * Image object containing all available images organized by name
 */
export const IMAGES = {
  FRAME_2147235238: Frame2147235238,
  FRAME_2147235239: Frame2147235239,
  FRAME_2147235240: Frame2147235240,
  FRAME_2147235241: Frame2147235241,
  FRAME_2147235244: Frame2147235244,
  FRAME_2147235245: Frame2147235245,
  FRAME_2147235246: Frame2147235246,
  FRAME_2147235250_1: Frame21472352501,
  FRAME_2147235250_2: Frame21472352502,
  FRAME_2147235250: Frame2147235250,
  FRAME_2147235257: Frame2147235257,
  FRAME_2147235258: Frame2147235258,
  FRAME_2147235259: Frame2147235259,
  FRAME_2147235260: Frame2147235260,
  FRAME_2147235565: Frame2147235565,
  HEART: HeartImage,
} as const;

/**
 * Type for image keys - ensures type safety when accessing images
 */
export type ImageKey = keyof typeof IMAGES;

/**
 * Get image by key
 * @param key - The image key from IMAGES object
 * @returns The image object (StaticImageData from Next.js Image component)
 */
export const getImage = (key: ImageKey) => {
  return IMAGES[key];
};

export default IMAGES;
