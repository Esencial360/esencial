import { TestBed } from '@angular/core/testing';

import { WeeklyPlanService } from './weekly-plan.service';

describe('WeeklyPlanService', () => {
  let service: WeeklyPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklyPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
