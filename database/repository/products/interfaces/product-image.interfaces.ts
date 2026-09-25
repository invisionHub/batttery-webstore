import { imageStatusEnum } from '../../../schema/product-image.schema';
import { ProductImage, NewProductImage } from '../../../types';

export type { ProductImage, NewProductImage };

export type ImageStatus = (typeof imageStatusEnum.enumValues)[number];

export interface ProductImageRepository {
  create(image: NewProductImage): Promise<ProductImage>;
  findByProductId(productId: string): Promise<ProductImage[]>;
  findPrimaryByProductId(productId: string): Promise<ProductImage | null>;
  findAllPrimaryProductIds(): Promise<Set<string>>;
  findByCloudinaryPublicId(publicId: string): Promise<ProductImage | null>;
  existsForProduct(productId: string): Promise<boolean>;
  updateStatus(id: string, status: ImageStatus): Promise<ProductImage>;
  delete(id: string): Promise<boolean>;
}

// Backwards-compatibility alias
export type ProductImageInterface = ProductImageRepository;
