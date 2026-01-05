import { Module } from '@nestjs/common';
import { KoofrService } from './koofr.service';
import { KoofrController } from './koofr.controller';

@Module({
  controllers: [KoofrController],
  providers: [KoofrService],
})
export class KoofrModule {}
