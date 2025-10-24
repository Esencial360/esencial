import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLiveClassComponent } from './admin-live-class.component';

describe('AdminLiveClassComponent', () => {
  let component: AdminLiveClassComponent;
  let fixture: ComponentFixture<AdminLiveClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLiveClassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLiveClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
