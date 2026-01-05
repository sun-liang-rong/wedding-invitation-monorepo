import { Test, TestingModule } from '@nestjs/testing';
import { KoofrService } from './koofr.service';

describe('KoofrService', () => {
  let service: KoofrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KoofrService],
    }).compile();

    service = module.get<KoofrService>(KoofrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
