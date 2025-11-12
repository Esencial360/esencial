import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomClassesUserComponent } from './zoom-classes-user.component';

describe('ZoomClassesUserComponent', () => {
  let component: ZoomClassesUserComponent;
  let fixture: ComponentFixture<ZoomClassesUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZoomClassesUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoomClassesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
