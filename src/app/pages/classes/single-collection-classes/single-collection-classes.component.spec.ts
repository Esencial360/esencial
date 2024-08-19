import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCollectionClassesComponent } from './single-collection-classes.component';

describe('SingleCollectionClassesComponent', () => {
  let component: SingleCollectionClassesComponent;
  let fixture: ComponentFixture<SingleCollectionClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleCollectionClassesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleCollectionClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
