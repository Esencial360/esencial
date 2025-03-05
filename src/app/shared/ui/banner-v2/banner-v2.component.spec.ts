import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerV2Component } from './banner-v2.component';

describe('BannerV2Component', () => {
  let component: BannerV2Component;
  let fixture: ComponentFixture<BannerV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BannerV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
