# Assets Organization Guide

## Folder Structure

```
assets/
├── icons/          # SVG icons (will be used with Icon component)
│   ├── Heart.svg
│   ├── Truck.svg
│   ├── Vector.svg
│   └── ...
├── images/         # PNG, JPG, WebP images (static images for backgrounds, etc.)
│   ├── Frame 2147235238.png
│   ├── Frame 2147235239.png
│   └── ...
└── other/          # Other assets (zips, fonts, etc.)
    └── Javal. LIGHT & PLUG CONCEPT.zip
```

## Setup Instructions

1. **Move SVG files** from `assets/` to `assets/icons/`
2. **Move image files** (PNG, JPG) from `assets/` to `assets/images/`
3. **Move other files** to `assets/other/`

## Usage Examples

### Using SVG Icons with the SvgIcon Component (Recommended)

#### Option 1: Using Icon Registry with SvgIcon (Type-Safe)

```tsx
import { SvgIcon } from '@/components/ui';
import { ICONS } from '@/assets/icons';

export function MyComponent() {
  return (
    <div>
      <SvgIcon icon="HEART" className="text-red-500" width={32} height={32} />
      <SvgIcon icon="TRUCK" className="text-blue-500" />
      <SvgIcon icon="VECTOR" />
    </div>
  );
}
```

#### Option 2: Using Icon Component with Imported SVGs

```tsx
import { Icon } from '@/components/ui';
import { ICONS } from '@/assets/icons';

export function MyComponent() {
  return <Icon name="HEART" className="text-red-500 hover:text-red-600" width={32} height={32} />;
}
```

### Available Icons

All icons are stored in the `ICONS` object in `assets/icons/index.ts`:

```typescript
ICONS.HEART; // Heart.svg
ICONS.TRUCK; // Truck.svg
ICONS.VECTOR; // Vector.svg
ICONS.VECTOR_1; // Vector (1).svg
ICONS.VECTOR_2; // Vector (2).svg
ICONS.VECTOR_3; // Vector (3).svg
ICONS.FRAME_2147235204; // Frame 2147235204.svg
ICONS.GROUP_27205; // Group 27205.svg
```

### Using Images

#### Option 1: Using the Image Registry (Type-Safe - Recommended)

```tsx
import Image from 'next/image';
import { IMAGES } from '@/assets/images';

export function MyComponent() {
  return <Image src={IMAGES.FRAME_2147235238} alt="Description" />;
}
```

#### Option 2: Using Image by Key (Type-Safe)

```tsx
import Image from 'next/image';
import { getImage } from '@/assets/images';

export function MyComponent() {
  return <Image src={getImage('FRAME_2147235238')} alt="Description" />;
}
```

#### Option 3: Direct Path (Not Recommended)

```tsx
import Image from 'next/image';

export function MyComponent() {
  return (
    <Image src="/assets/images/Frame 2147235238.png" alt="Description" width={400} height={300} />
  );
}
```

## Image Registry

All images are centralized in `assets/images/index.ts` and exported as the `IMAGES` object. This provides type-safe access to all images throughout your app.

### Available Images

```typescript
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
```

### Adding New Images

1. Save your image file in `assets/images/` folder
2. Import it at the top of `assets/images/index.ts`:
   ```typescript
   import MyNewImage from './MyNewImage.png';
   ```
3. Add it to the `IMAGES` object:
   ```typescript
   export const IMAGES = {
     // ... existing images
     MY_NEW_IMAGE: MyNewImage,
   } as const;
   ```
4. Use it in your component:

   ```tsx
   import Image from 'next/image';
   import { IMAGES } from '@/assets/images';

   <Image src={IMAGES.MY_NEW_IMAGE} alt="My new image" />;
   ```

## Adding New Icons

1. Save your SVG file in `assets/icons/` folder
2. Import it at the top of `assets/icons/index.ts`:
   ```typescript
   import MyNewIcon from './MyNewIcon.svg';
   ```
3. Add it to the `ICONS` object:
   ```typescript
   export const ICONS = {
     HEART: Heart,
     TRUCK: Truck,
     MY_NEW_ICON: MyNewIcon, // Add your new icon here
   } as const;
   ```
4. Use it in your component:

   ```tsx
   import { SvgIcon } from '@/components/ui';

   <SvgIcon icon="MY_NEW_ICON" className="text-blue-500" width={32} height={32} />;
   ```

## Icon Component Props

### SvgIcon (Recommended)

```typescript
interface IconProps extends SVGProps<SVGSVGElement> {
  icon: keyof typeof ICONS; // Icon key from ICONS object
  className?: string; // CSS classes for styling
  width?: number | string; // Icon width (default: 24)
  height?: number | string; // Icon height (default: 24)
}
```

### Icon (Alternative)

```typescript
interface IconProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof ICONS | string; // Icon key from ICONS object
  className?: string; // CSS classes for styling
  width?: number | string; // Icon width (default: 24)
  height?: number | string; // Icon height (default: 24)
}
```

## Notes

- SVG files are imported directly and exported in the `ICONS` object for type safety
- Both `SvgIcon` and `Icon` components work with the imported SVG modules
- Use `SvgIcon` for better SVG-specific rendering and styling
- Use `Icon` as a fallback alternative
- Both components will show a placeholder icon (?) if the icon is not found
- Always update `assets/icons/index.ts` when adding new SVG files
