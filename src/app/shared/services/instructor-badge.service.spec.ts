import { TestBed } from '@angular/core/testing';

import { InstructorBadgeService } from './instructor-badge.service';

describe('InstructorBadgeService', () => {
  let service: InstructorBadgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructorBadgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
