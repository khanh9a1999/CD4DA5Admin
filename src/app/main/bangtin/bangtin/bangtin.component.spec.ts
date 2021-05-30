import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BangTinComponent } from './bangtin.component';

describe('BangTinComponent', () => {
  let component: BangTinComponent;
  let fixture: ComponentFixture<BangTinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BangTinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BangTinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
