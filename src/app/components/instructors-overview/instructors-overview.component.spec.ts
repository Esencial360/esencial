import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorsOverviewComponent } from './instructors-overview.component';

describe('InstructorsOverviewComponent', () => {
  let component: InstructorsOverviewComponent;
  let fixture: ComponentFixture<InstructorsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorsOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructorsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
