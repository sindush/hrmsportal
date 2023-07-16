import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedtableComponent } from './sharedtable.component';

describe('SharedtableComponent', () => {
  let component: SharedtableComponent;
  let fixture: ComponentFixture<SharedtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedtableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
