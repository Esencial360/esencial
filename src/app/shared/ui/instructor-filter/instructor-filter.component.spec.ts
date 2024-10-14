import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorFilterComponent } from './instructor-filter.component';

describe('InstructorFilterComponent', () => {
  let component: InstructorFilterComponent;
  let fixture: ComponentFixture<InstructorFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
