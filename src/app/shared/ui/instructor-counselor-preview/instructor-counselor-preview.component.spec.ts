import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCounselorPreviewComponent } from './instructor-counselor-preview.component';

describe('InstructorCounselorPreviewComponent', () => {
  let component: InstructorCounselorPreviewComponent;
  let fixture: ComponentFixture<InstructorCounselorPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorCounselorPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorCounselorPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
