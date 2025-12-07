import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { CursoForm } from './curso-form';

describe('CursoForm', () => {
  let component: CursoForm;
  let fixture: ComponentFixture<CursoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CursoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CursoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
