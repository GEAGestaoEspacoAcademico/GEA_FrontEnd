import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { MultiDateSelector } from './multi-date-selector';

describe('MultiDateSelector', () => {
  let component: MultiDateSelector;
  let fixture: ComponentFixture<MultiDateSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiDateSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiDateSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
