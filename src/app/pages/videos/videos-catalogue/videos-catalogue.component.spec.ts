import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosCatalogueComponent } from './videos-catalogue.component';

describe('VideosCatalogueComponent', () => {
  let component: VideosCatalogueComponent;
  let fixture: ComponentFixture<VideosCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideosCatalogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideosCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
