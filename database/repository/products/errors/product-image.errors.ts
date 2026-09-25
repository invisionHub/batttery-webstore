export class ProductImageError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ProductImageError';
  }
}

export class ProductImageNotFoundError extends ProductImageError {
  constructor(id: string) {
    super(`Product image with id "${id}" was not found.`);
    this.name = 'ProductImageNotFoundError';
  }
}

export class DuplicatePrimaryImageError extends ProductImageError {
  constructor(productId: string) {
    super(`Product "${productId}" already has a primary image. Only one primary image is allowed per product.`);
    this.name = 'DuplicatePrimaryImageError';
  }
}

export class ProductNotFoundError extends ProductImageError {
  constructor(productId: string) {
    super(`Product with id "${productId}" does not exist.`);
    this.name = 'ProductNotFoundError';
  }
}
