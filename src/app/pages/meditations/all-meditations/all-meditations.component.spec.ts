import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMeditationsComponent } from './all-meditations.component';

describe('AllMeditationsComponent', () => {
  let component: AllMeditationsComponent;
  let fixture: ComponentFixture<AllMeditationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllMeditationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMeditationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
