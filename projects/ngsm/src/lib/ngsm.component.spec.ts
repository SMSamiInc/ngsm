import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgsmComponent } from './ngsm.component';

describe('NgsmComponent', () => {
  let component: NgsmComponent;
  let fixture: ComponentFixture<NgsmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgsmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgsmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
