import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesCatalogueComponent } from './classes-catalogue.component';

describe('ClassesCatalogueComponent', () => {
  let component: ClassesCatalogueComponent;
  let fixture: ComponentFixture<ClassesCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClassesCatalogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassesCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
