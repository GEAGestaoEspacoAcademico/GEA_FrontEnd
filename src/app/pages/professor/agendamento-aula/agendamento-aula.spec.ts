import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { AgendamentoAula } from './agendamento-aula';

describe('AgendamentoAula', () => {
  let component: AgendamentoAula;
  let fixture: ComponentFixture<AgendamentoAula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendamentoAula],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendamentoAula);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
