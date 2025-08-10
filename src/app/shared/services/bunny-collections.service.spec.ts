import { TestBed } from '@angular/core/testing';

import { BunnyCollectionsService } from './bunny-collections.service';

describe('BunnyCollectionsService', () => {
  let service: BunnyCollectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BunnyCollectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
