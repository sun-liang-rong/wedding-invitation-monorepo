import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from './types';

@Injectable()
export class UploadService {
  uploadCover(file: Express.Multer.File): UploadApiResponse {
    return {
      success: true,
      url: `/uploads/${file?.filename}`,
      filename: file?.filename,
    };
  }

  uploadGallery(files: Express.Multer.File[]): UploadApiResponse {
    const urls = files.map((file) => ({
      url: `/uploads/${file?.filename}`,
      filename: file?.filename,
    }));

    return {
      success: true,
      urls,
    };
  }
}
