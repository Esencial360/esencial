import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLiveClassesComponent } from './edit-live-classes.component';

describe('EditLiveClassesComponent', () => {
  let component: EditLiveClassesComponent;
  let fixture: ComponentFixture<EditLiveClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditLiveClassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLiveClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
