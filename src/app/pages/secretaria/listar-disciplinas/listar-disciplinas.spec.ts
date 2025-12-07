import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ListarDisciplinas } from './listar-disciplinas';

describe('ListarDisciplinas', () => {
  let component: ListarDisciplinas;
  let fixture: ComponentFixture<ListarDisciplinas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarDisciplinas],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarDisciplinas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
