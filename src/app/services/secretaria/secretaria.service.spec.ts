import { TestBed } from '@angular/core/testing';

import { SecretariaService } from './secretaria.service';

describe('SecretariaService', () => {
  let service: SecretariaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecretariaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
