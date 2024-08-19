import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionSneakPeakComponent } from './section-sneak-peak.component';

describe('SectionSneakPeakComponent', () => {
  let component: SectionSneakPeakComponent;
  let fixture: ComponentFixture<SectionSneakPeakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionSneakPeakComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SectionSneakPeakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
