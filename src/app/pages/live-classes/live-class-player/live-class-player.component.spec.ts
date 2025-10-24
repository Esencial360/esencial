import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveClassPlayerComponent } from './live-class-player.component';

describe('LiveClassPlayerComponent', () => {
  let component: LiveClassPlayerComponent;
  let fixture: ComponentFixture<LiveClassPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveClassPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveClassPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
