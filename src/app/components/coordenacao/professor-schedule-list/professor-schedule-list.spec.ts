import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ProfessorScheduleList } from './professor-schedule-list';

describe('ProfessorScheduleList', () => {
  let component: ProfessorScheduleList;
  let fixture: ComponentFixture<ProfessorScheduleList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfessorScheduleList],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessorScheduleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
