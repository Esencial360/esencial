import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPopupComponent } from './dialog-popup.component';

describe('DialogPopupComponent', () => {
  let component: DialogPopupComponent;
  let fixture: ComponentFixture<DialogPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
