import { TestBed } from '@angular/core/testing';

import { AuxiliarDocenteService } from './auxiliar-docente.service';

describe('AuxiliarDocenteService', () => {
  let service: AuxiliarDocenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuxiliarDocenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
