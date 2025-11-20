import { TestBed } from '@angular/core/testing';

import { CoordenadorService } from './coordenador.service';

describe('CoordenadorService', () => {
  let service: CoordenadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoordenadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
