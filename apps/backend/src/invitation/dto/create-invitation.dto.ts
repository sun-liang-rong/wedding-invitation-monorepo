import {
  IsString,
  IsOptional,
  IsArray,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
export class CreateInvitationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  groomName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  brideName: string;

  @Transform(({ value }: { value: string }) => {
    // 如果前端传 "2026-05-20"，自动补全成完整格式
    if (value && !value?.includes('T')) {
      return `${value}T00:00:00.000Z`;
    }
    return value;
  })
  weddingDate: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  weddingTime: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  locationName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  locationAddress: string;

  @IsString()
  coverImage: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryImages?: string[];

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  blessingText: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  templateId?: string;
}
