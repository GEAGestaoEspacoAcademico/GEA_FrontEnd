import { TestBed } from '@angular/core/testing';

import { Funcionario } from './funcionario';

describe('Funcionario', () => {
  let service: Funcionario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Funcionario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
