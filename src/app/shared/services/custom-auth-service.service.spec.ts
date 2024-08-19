import { TestBed } from '@angular/core/testing';

import { CustomAuthServiceService } from './custom-auth-service.service';

describe('CustomAuthServiceService', () => {
  let service: CustomAuthServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomAuthServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
