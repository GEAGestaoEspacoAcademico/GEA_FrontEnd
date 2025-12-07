import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { RecurringSchedulingForm } from './recurring-scheduling-form';

describe('RecurringSchedulingForm', () => {
  let component: RecurringSchedulingForm;
  let fixture: ComponentFixture<RecurringSchedulingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecurringSchedulingForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RecurringSchedulingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
