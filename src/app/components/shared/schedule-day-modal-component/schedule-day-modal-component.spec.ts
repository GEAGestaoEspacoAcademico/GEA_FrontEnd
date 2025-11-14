import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDayModalComponent } from './schedule-day-modal-component';

describe('ScheduleDayModalComponent', () => {
  let component: ScheduleDayModalComponent;
  let fixture: ComponentFixture<ScheduleDayModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleDayModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleDayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
