import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminZoomClassListComponent } from './admin-zoom-class-list.component';

describe('AdminZoomClassListComponent', () => {
  let component: AdminZoomClassListComponent;
  let fixture: ComponentFixture<AdminZoomClassListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminZoomClassListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminZoomClassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
