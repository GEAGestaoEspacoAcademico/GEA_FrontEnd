import { TestBed } from '@angular/core/testing';

import { TipoSalaService } from './tipo-sala.service';

describe('TipoSalaService', () => {
  let service: TipoSalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoSalaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
