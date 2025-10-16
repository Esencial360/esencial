import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveClassesListComponent } from './live-classes-list.component';

describe('LiveClassesListComponent', () => {
  let component: LiveClassesListComponent;
  let fixture: ComponentFixture<LiveClassesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveClassesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveClassesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
