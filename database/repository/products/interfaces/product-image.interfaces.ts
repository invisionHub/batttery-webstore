import { imageStatusEnum } from '../../../schema/product-image.schema';
import { ProductImage, NewProductImage } from '../../../types';
type ststus = typeof imageStatusEnum;
interface ProductImageInterface {
  create: (input: NewProductImage) => Promise<ProductImage>;
  findByProductId: (id: string) => Promise<ProductImage[]>;
  findPrimaryByProductId: (id: string) => Promise<ProductImage | null>;
  findByCloudinaryPublicId: (publicId: string) => Promise<ProductImage | null>;
  existsForProducts: (id: string) => Promise<ProductImage[] | null>;
}
