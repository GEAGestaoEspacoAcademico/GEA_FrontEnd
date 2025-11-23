import { TestBed } from '@angular/core/testing';

import { TipoRecursoService } from './tipo-recurso.service';

describe('TipoRecursoService', () => {
  let service: TipoRecursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoRecursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
