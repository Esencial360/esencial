import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerV3Component } from './banner-v3.component';

describe('BannerV3Component', () => {
  let component: BannerV3Component;
  let fixture: ComponentFixture<BannerV3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BannerV3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
