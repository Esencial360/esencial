import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWeeklyPlanComponent } from './admin-weekly-plan.component';

describe('AdminWeeklyPlanComponent', () => {
  let component: AdminWeeklyPlanComponent;
  let fixture: ComponentFixture<AdminWeeklyPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminWeeklyPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminWeeklyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
