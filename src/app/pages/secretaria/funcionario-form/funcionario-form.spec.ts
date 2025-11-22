import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';

import { FuncionarioForm } from './funcionario-form';

describe('FuncionarioForm', () => {
  let component: FuncionarioForm;
  let fixture: ComponentFixture<FuncionarioForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FuncionarioForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionarioForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
