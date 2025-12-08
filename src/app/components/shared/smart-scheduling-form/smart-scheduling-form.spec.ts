import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { SmartSchedulingForm } from './smart-scheduling-form';

describe('SmartSchedulingForm', () => {
  let component: SmartSchedulingForm;
  let fixture: ComponentFixture<SmartSchedulingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmartSchedulingForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartSchedulingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
