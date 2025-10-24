import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorBadgeComponent } from './instructor-badge.component';

describe('InstructorBadgeComponent', () => {
  let component: InstructorBadgeComponent;
  let fixture: ComponentFixture<InstructorBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
