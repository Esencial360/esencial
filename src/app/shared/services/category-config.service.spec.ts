import { TestBed } from '@angular/core/testing';

import { CategoryConfigService } from './category-config.service';

describe('CategoryConfigService', () => {
  let service: CategoryConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
