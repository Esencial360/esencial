import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveClassComponent } from './approve-class.component';

describe('ApproveClassComponent', () => {
  let component: ApproveClassComponent;
  let fixture: ComponentFixture<ApproveClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApproveClassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
