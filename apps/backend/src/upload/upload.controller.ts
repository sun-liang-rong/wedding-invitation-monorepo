import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('cover')
  @UseInterceptors(FileInterceptor('file'))
  uploadCover(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('请选择要上传的图片', HttpStatus.BAD_REQUEST);
    }

    return this.uploadService.uploadCover(file);
  }

  @Post('gallery')
  @UseInterceptors(FilesInterceptor('files', 6))
  uploadGallery(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new HttpException('请选择要上传的图片', HttpStatus.BAD_REQUEST);
    }

    if (files.length > 6) {
      throw new HttpException('最多只能上传6张图片', HttpStatus.BAD_REQUEST);
    }

    return this.uploadService.uploadGallery(files);
  }
}
