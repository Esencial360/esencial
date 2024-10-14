import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousClassesComponent } from './previous-classes.component';

describe('PreviousClassesComponent', () => {
  let component: PreviousClassesComponent;
  let fixture: ComponentFixture<PreviousClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviousClassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
