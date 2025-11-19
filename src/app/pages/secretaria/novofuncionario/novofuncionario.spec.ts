import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Novofuncionario } from './novofuncionario';

describe('Novofuncionario', () => {
  let component: Novofuncionario;
  let fixture: ComponentFixture<Novofuncionario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Novofuncionario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Novofuncionario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
