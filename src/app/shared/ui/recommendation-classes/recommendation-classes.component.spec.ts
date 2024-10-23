import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationClassesComponent } from './recommendation-classes.component';

describe('RecommendationClassesComponent', () => {
  let component: RecommendationClassesComponent;
  let fixture: ComponentFixture<RecommendationClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecommendationClassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendationClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
