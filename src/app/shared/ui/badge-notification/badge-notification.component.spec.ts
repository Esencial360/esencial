import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeNotificationComponent } from './badge-notification.component';

describe('BadgeNotificationComponent', () => {
  let component: BadgeNotificationComponent;
  let fixture: ComponentFixture<BadgeNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BadgeNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgeNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
