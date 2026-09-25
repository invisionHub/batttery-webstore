import { cloudinary } from './client';
import { CloudinaryError } from './errorHandling';
import { ICloudinaryInterface } from './interface';
import { CloudinaryDeleteResult, CloudinaryUploadInput, CloudinaryUploadResult } from './types';

const isCloudinaryNotFoundError = (error: string) => error === 'Not Found';

export class CloudinaryService implements ICloudinaryInterface {
  async upload(input: CloudinaryUploadInput): Promise<CloudinaryUploadResult> {
    try {
      if (typeof input.file === 'string') {
        const result = await cloudinary.uploader.upload(input.file, {
          folder: input.folder,
          public_id: input.publicId,
          overwrite: input.overwrite,
        });

        return {
          publicId: result.public_id,
          resourceType: result.resource_type,
          secureUrl: result.secure_url,
          bytes: result.bytes,
          format: result.format,
          height: result.height,
          width: result.width,
        };
      }

      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: input.folder,
            public_id: input.publicId,
            overwrite: input.overwrite,
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            if (!result) {
              reject(new Error('Cloudinary returned no upload Result'));
              return;
            }
            resolve({
              publicId: result.public_id,
              resourceType: result.resource_type,
              secureUrl: result.secure_url,
              bytes: result.bytes,
              format: result.format,
              height: result.height,
              width: result.width,
            });
          }
        );
        uploadStream.end(input.file);
      });
    } catch (error: unknown) {
      throw new CloudinaryError('Failed to upload Url', error);
    }
  }
  async delete(publicId: string): Promise<CloudinaryDeleteResult> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        type: 'upload',
        invalidate: true,
      });

      return {
        publicId,
        deleted: result.result === 'ok',
      };
    } catch (error: unknown) {
      throw new CloudinaryError(`Failed to Delete cloudinary asset with ${publicId}`, error);
    }
  }
  async exist(publicId: string): Promise<boolean> {
    try {
      await cloudinary.api.resource(publicId, {
        resource_type: 'image',
        type: 'upload',
      });
      return true;
    } catch (error: unknown) {
      return false;
    }
  }
}

export const cloudinaryService = new CloudinaryService();

