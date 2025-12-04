import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCursos } from './listar-cursos';

describe('ListarCursos', () => {
  let component: ListarCursos;
  let fixture: ComponentFixture<ListarCursos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarCursos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarCursos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
