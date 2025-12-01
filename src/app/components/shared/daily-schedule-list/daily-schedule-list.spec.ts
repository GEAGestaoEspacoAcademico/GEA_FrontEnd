import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { DailyScheduleList } from './daily-schedule-list';

describe('DailyScheduleList', () => {
  let component: DailyScheduleList;
  let fixture: ComponentFixture<DailyScheduleList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DailyScheduleList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyScheduleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
