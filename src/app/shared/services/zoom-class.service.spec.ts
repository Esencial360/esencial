import { TestBed } from '@angular/core/testing';

import { ZoomClassService } from './zoom-class.service';

describe('ZoomClassService', () => {
  let service: ZoomClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoomClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
