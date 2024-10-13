import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassThumbnailComponent } from './class-thumbnail.component';

describe('ClassThumbnailComponent', () => {
  let component: ClassThumbnailComponent;
  let fixture: ComponentFixture<ClassThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClassThumbnailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
