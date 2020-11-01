import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteButtonComponent } from './remote-button.component';

describe('RemoteButtonComponent', () => {
  let component: RemoteButtonComponent;
  let fixture: ComponentFixture<RemoteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoteButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
