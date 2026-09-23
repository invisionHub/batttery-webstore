import { FOLDER_NAME, PRIMARY_PUBLIC_ID } from './constants';

export const cloudinaryNaming = {
  sanitizeSku(sku: string) {
    return sku
      .trim()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-');
  },
  getProductFolder(sku: string) {
    return `${FOLDER_NAME}/${this.sanitizeSku(sku)}`;
  },
  getPrimaryPublicID(sku: string) {
    return `${FOLDER_NAME}/${this.sanitizeSku(sku)}/${PRIMARY_PUBLIC_ID}`;
  },
  getGalleryPublicId(sku: string, sortOrder: number) {
    return `${FOLDER_NAME}/${this.sanitizeSku(sku)}/gallery-${sortOrder}`;
  },
};
