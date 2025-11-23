import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ScheduleEvent } from './schedule-event';

describe('ScheduleEvent', () => {
  let component: ScheduleEvent;
  let fixture: ComponentFixture<ScheduleEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
