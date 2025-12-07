import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { DisciplinaForm } from './disciplina-form';

describe('DisciplinaForm', () => {
  let component: DisciplinaForm;
  let fixture: ComponentFixture<DisciplinaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisciplinaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DisciplinaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
