import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnirsComponent } from './learnirs.component';

describe('LearnirsComponent', () => {
  let component: LearnirsComponent;
  let fixture: ComponentFixture<LearnirsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnirsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnirsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
