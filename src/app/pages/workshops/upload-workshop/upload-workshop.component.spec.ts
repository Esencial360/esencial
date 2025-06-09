import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadWorkshopComponent } from './upload-workshop.component';

describe('UploadWorkshopComponent', () => {
  let component: UploadWorkshopComponent;
  let fixture: ComponentFixture<UploadWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadWorkshopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
