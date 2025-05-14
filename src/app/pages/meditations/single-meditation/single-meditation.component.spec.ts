import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMeditationComponent } from './single-meditation.component';

describe('SingleMeditationComponent', () => {
  let component: SingleMeditationComponent;
  let fixture: ComponentFixture<SingleMeditationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleMeditationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleMeditationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
