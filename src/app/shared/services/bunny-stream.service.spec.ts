import { TestBed } from '@angular/core/testing';

import { BunnyStreamService } from './bunny-stream.service';

describe('BunnyStreamService', () => {
  let service: BunnyStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BunnyStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
