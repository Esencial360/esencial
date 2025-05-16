import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeditationThumbnailComponent } from './meditation-thumbnail.component';

describe('MeditationThumbnailComponent', () => {
  let component: MeditationThumbnailComponent;
  let fixture: ComponentFixture<MeditationThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeditationThumbnailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeditationThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
