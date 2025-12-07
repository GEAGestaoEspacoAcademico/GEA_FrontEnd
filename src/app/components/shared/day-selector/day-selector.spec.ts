import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';

import { DaySelector } from './day-selector';

describe('DaySelector', () => {
  let component: DaySelector;
  let fixture: ComponentFixture<DaySelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DaySelector],
    }).compileComponents();

    fixture = TestBed.createComponent(DaySelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
