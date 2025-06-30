import { TestBed } from '@angular/core/testing';

import { ReferralCodeService } from './referral-code.service';

describe('ReferralCodeService', () => {
  let service: ReferralCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferralCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
