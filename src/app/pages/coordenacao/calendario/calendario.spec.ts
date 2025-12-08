import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { Calendario } from './calendario';

describe('Calendario', () => {
  let component: Calendario;
  let fixture: ComponentFixture<Calendario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Calendario],
    }).compileComponents();

    fixture = TestBed.createComponent(Calendario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
