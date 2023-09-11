import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureTextDescriptionComponent } from './feature-text-description.component';

describe('FeatureTextDescriptionComponent', () => {
  let component: FeatureTextDescriptionComponent;
  let fixture: ComponentFixture<FeatureTextDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeatureTextDescriptionComponent]
    });
    fixture = TestBed.createComponent(FeatureTextDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
