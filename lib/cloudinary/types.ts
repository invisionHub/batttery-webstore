export interface CloudinaryUploadInput {
  file: Buffer;
  folder?: string;
  publicId?: string;
}

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  resourceType: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export interface CloudinaryDeleteResult {
  publicId: string;
  deleted: boolean;
}
