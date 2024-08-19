import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorSingUpComponent } from './instructor-sing-up.component';

describe('InstructorSingUpComponent', () => {
  let component: InstructorSingUpComponent;
  let fixture: ComponentFixture<InstructorSingUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorSingUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructorSingUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
