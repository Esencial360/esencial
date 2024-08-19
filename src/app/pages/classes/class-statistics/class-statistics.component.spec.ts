import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassStatisticsComponent } from './class-statistics.component';

describe('ClassStatisticsComponent', () => {
  let component: ClassStatisticsComponent;
  let fixture: ComponentFixture<ClassStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClassStatisticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
