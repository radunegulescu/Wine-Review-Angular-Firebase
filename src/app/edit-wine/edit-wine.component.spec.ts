import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWineComponent } from './edit-wine.component';

describe('EditWineComponent', () => {
  let component: EditWineComponent;
  let fixture: ComponentFixture<EditWineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
