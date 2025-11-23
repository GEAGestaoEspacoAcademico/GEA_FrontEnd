import { TestBed } from '@angular/core/testing';

import { TempService } from './temp-service';

describe('TempService', () => {
  let service: TempService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TempService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
