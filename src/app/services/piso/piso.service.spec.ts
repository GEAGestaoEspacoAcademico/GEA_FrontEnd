import { TestBed } from '@angular/core/testing';

import { PisoService } from './piso.service';

describe('PisoService', () => {
  let service: PisoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PisoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
