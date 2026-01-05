import { Controller } from '@nestjs/common';
import { KoofrService } from './koofr.service';

@Controller('koofr')
export class KoofrController {
  constructor(private readonly koofrService: KoofrService) {}
}
