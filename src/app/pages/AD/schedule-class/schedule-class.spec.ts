import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ScheduleClass } from './schedule-class';

describe('ScheduleClass', () => {
  let component: ScheduleClass;
  let fixture: ComponentFixture<ScheduleClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleClass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleClass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
