import { Test, TestingModule } from '@nestjs/testing';
import { VerifyemailController } from './verifyemail.controller';

describe('VerifyemailController', () => {
  let controller: VerifyemailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerifyemailController],
    }).compile();

    controller = module.get<VerifyemailController>(VerifyemailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
