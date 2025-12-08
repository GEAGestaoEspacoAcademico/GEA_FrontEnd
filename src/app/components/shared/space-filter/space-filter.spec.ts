import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { SpaceFilter } from './space-filter';

describe('SpaceFilter', () => {
  let component: SpaceFilter;
  let fixture: ComponentFixture<SpaceFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(SpaceFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
