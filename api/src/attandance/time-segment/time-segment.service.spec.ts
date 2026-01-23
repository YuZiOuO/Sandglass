import { Test, TestingModule } from '@nestjs/testing';
import { TimeSegmentService } from './time-segment.service';

describe('TimeSegmentService', () => {
  let service: TimeSegmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeSegmentService],
    }).compile();

    service = module.get<TimeSegmentService>(TimeSegmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
