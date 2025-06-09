import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleWorkshopComponent } from './single-workshop.component';

describe('SingleWorkshopComponent', () => {
  let component: SingleWorkshopComponent;
  let fixture: ComponentFixture<SingleWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleWorkshopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
