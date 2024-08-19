import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorsCatalogueComponent } from './instructors-catalogue.component';

describe('InstructorsCatalogueComponent', () => {
  let component: InstructorsCatalogueComponent;
  let fixture: ComponentFixture<InstructorsCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorsCatalogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructorsCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
