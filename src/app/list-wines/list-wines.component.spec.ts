import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWinesComponent } from './list-wines.component';

describe('ListWinesComponent', () => {
  let component: ListWinesComponent;
  let fixture: ComponentFixture<ListWinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListWinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
