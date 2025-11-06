import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminZoomClassFormComponent } from './admin-zoom-class-form.component';

describe('AdminZoomClassFormComponent', () => {
  let component: AdminZoomClassFormComponent;
  let fixture: ComponentFixture<AdminZoomClassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminZoomClassFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminZoomClassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
