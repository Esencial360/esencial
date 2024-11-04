import { TestBed } from '@angular/core/testing';

import { LikedClassesService } from './liked-classes.service';

describe('LikedClassesService', () => {
  let service: LikedClassesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikedClassesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
