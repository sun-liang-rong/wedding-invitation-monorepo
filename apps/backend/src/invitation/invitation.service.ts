import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { Invitation } from '../entities/invitation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) {}

  private generateSlug(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * 5) + 6;
    let slug = '';
    for (let i = 0; i < length; i++) {
      slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return slug;
  }

  private async isSlugUnique(slug: string): Promise<boolean> {
    const invitation = await this.invitationRepository.findOne({
      where: { slug },
    });
    return !invitation;
  }

  private async generateUniqueSlug(): Promise<string> {
    let slug = this.generateSlug();
    let attempts = 0;
    const maxAttempts = 10;

    while (!(await this.isSlugUnique(slug)) && attempts < maxAttempts) {
      slug = this.generateSlug();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new ConflictException('Failed to generate unique slug');
    }

    return slug;
  }

  async create(createInvitationDto: CreateInvitationDto): Promise<Invitation> {
    const slug = await this.generateUniqueSlug();
    console.log({
      ...createInvitationDto,
      slug,
      galleryImages: createInvitationDto.galleryImages || [],
    });

    return this.invitationRepository.save({
      ...createInvitationDto,
      slug,
      galleryImages: createInvitationDto.galleryImages || [],
    });
  }

  async findBySlug(slug: string): Promise<Invitation> {
    const invitation = await this.invitationRepository.findOne({
      where: { slug },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    return invitation;
  }
}
