import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorAdminViewComponent } from './instructor-admin-view.component';

describe('InstructorAdminViewComponent', () => {
  let component: InstructorAdminViewComponent;
  let fixture: ComponentFixture<InstructorAdminViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorAdminViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorAdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
