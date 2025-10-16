import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLiveClassesListComponent } from './admin-live-classes-list.component';

describe('AdminLiveClassesListComponent', () => {
  let component: AdminLiveClassesListComponent;
  let fixture: ComponentFixture<AdminLiveClassesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLiveClassesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLiveClassesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
