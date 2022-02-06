import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateWineComponent } from './rate-wine.component';

describe('RateWineComponent', () => {
  let component: RateWineComponent;
  let fixture: ComponentFixture<RateWineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateWineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateWineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
