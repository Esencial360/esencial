import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodCollectionComponent } from './mood-collection.component';

describe('MoodCollectionComponent', () => {
  let component: MoodCollectionComponent;
  let fixture: ComponentFixture<MoodCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoodCollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
