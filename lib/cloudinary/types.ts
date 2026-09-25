export interface CloudinaryUploadInput {
  file: Buffer | string;
  folder?: string;
  publicId?: string;
  overwrite?: boolean;
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
