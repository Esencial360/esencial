import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorActionsComponent } from './instructor-actions.component';

describe('InstructorActionsComponent', () => {
  let component: InstructorActionsComponent;
  let fixture: ComponentFixture<InstructorActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
