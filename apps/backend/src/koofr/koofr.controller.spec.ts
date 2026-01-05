import { Test, TestingModule } from '@nestjs/testing';
import { KoofrController } from './koofr.controller';
import { KoofrService } from './koofr.service';

describe('KoofrController', () => {
  let controller: KoofrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KoofrController],
      providers: [KoofrService],
    }).compile();

    controller = module.get<KoofrController>(KoofrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
