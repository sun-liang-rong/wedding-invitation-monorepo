import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
@Controller('api/invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  async create(@Body() createInvitationDto: CreateInvitationDto) {
    const invitation = await this.invitationService.create(createInvitationDto);
    return {
      success: true,
      data: {
        slug: invitation.slug,
        url: `/invite/${invitation.slug}`,
      },
    };
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const invitation = await this.invitationService.findBySlug(slug);
    return {
      success: true,
      data: invitation,
    };
  }
}
