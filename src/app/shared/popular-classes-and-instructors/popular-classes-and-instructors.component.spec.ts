import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularClassesAndInstructorsComponent } from './popular-classes-and-instructors.component';

describe('PopularClassesAndInstructorsComponent', () => {
  let component: PopularClassesAndInstructorsComponent;
  let fixture: ComponentFixture<PopularClassesAndInstructorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopularClassesAndInstructorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularClassesAndInstructorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
