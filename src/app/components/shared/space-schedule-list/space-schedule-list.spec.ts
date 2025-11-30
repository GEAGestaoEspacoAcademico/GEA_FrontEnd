import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { SpaceScheduleList } from './space-schedule-list';

describe('SpaceScheduleList', () => {
  let component: SpaceScheduleList;
  let fixture: ComponentFixture<SpaceScheduleList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceScheduleList],
    }).compileComponents();

    fixture = TestBed.createComponent(SpaceScheduleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
