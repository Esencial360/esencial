import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMeditationsComponent } from './upload-meditations.component';

describe('UploadMeditationsComponent', () => {
  let component: UploadMeditationsComponent;
  let fixture: ComponentFixture<UploadMeditationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadMeditationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadMeditationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
