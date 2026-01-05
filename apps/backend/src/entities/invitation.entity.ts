import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'groom_name' })
  groomName: string;

  @Column({ name: 'bride_name' })
  brideName: string;

  @Column({ name: 'wedding_date', type: 'datetime' })
  weddingDate: Date;

  @Column({ name: 'wedding_time' })
  weddingTime: string;

  @Column({ name: 'location_name' })
  locationName: string;

  @Column({ name: 'location_address' })
  locationAddress: string;

  @Column({ name: 'cover_image' })
  coverImage: string;

  @Column({ type: 'simple-array', name: 'gallery_images' })
  galleryImages: string[];

  @Column({ name: 'blessing_text', type: 'text', nullable: true })
  blessingText: string;

  @Column({ name: 'template_id', default: 'classic' })
  templateId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
