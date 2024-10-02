import { Test, TestingModule } from '@nestjs/testing';
import { VerifyemailService } from './verifyemail.service';

describe('VerifyemailService', () => {
  let service: VerifyemailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerifyemailService],
    }).compile();

    service = module.get<VerifyemailService>(VerifyemailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
