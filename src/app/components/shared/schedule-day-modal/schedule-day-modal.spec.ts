import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ScheduleDayModal } from './schedule-day-modal';

describe('ScheduleDayModalComponent', () => {
  let component: ScheduleDayModal;
  let fixture: ComponentFixture<ScheduleDayModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleDayModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleDayModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
