/**
 * Icon Registry
 * This file imports and exports all SVG icons from the assets/icons folder
 * Usage: import { ICONS } from '@/assets/icons'; then use <Icon name={ICONS.HEART} />
 */

import Heart from './Heart.svg';
import Truck from './Truck.svg';
import Vector from './Vector.svg';
import Vector1 from './Vector (1).svg';
import Vector2 from './Vector (2).svg';
import Vector3 from './Vector (3).svg';
import Frame2147235204 from './Frame 2147235204.svg';
import Group27205 from './Group 27205.svg';

/**
 * Icon object containing all available SVG icons organized by key
 * Each icon is an imported SVG module
 */
export const ICONS = {
  // UI Icons
  HEART: Heart,
  TRUCK: Truck,

  // Vector Icons
  VECTOR: Vector,
  VECTOR_1: Vector1,
  VECTOR_2: Vector2,
  VECTOR_3: Vector3,

  // Frame Icons
  FRAME_2147235204: Frame2147235204,
  Logo: Group27205,
} as const;

/**
 * Type for icon keys - ensures type safety when accessing icons
 */
export type IconKey = keyof typeof ICONS;

/**
 * Get icon by key
 * @param key - The icon key from ICONS object
 * @returns The icon SVG module
 */
export const getIcon = (key: IconKey) => {
  return ICONS[key];
};

export default ICONS;
