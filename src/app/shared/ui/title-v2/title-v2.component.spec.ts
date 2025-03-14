import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleV2Component } from './title-v2.component';

describe('TitleV2Component', () => {
  let component: TitleV2Component;
  let fixture: ComponentFixture<TitleV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitleV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
