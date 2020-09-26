import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnirDetailComponent } from './learnir-detail.component';

describe('LearnirDetailComponent', () => {
  let component: LearnirDetailComponent;
  let fixture: ComponentFixture<LearnirDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnirDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnirDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
