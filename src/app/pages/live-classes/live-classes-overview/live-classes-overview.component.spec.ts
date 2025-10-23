import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveClassesOverviewComponent } from './live-classes-overview.component';

describe('LiveClassesOverviewComponent', () => {
  let component: LiveClassesOverviewComponent;
  let fixture: ComponentFixture<LiveClassesOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveClassesOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveClassesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
