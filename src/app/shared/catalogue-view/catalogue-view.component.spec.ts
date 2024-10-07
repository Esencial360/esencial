import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueViewComponent } from './catalogue-view.component';

describe('CatalogueViewComponent', () => {
  let component: CatalogueViewComponent;
  let fixture: ComponentFixture<CatalogueViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CatalogueViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogueViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
