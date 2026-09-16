import { CloudinaryDeleteResult, CloudinaryUploadInput, CloudinaryUploadResult } from './types';

export interface ICloudinaryInterface {
  upload: (input: CloudinaryUploadInput) => Promise<CloudinaryUploadResult>;
  delete: (publicId: string) => Promise<CloudinaryDeleteResult>;
  exist: (publicId: string) => Promise<boolean>;
}
