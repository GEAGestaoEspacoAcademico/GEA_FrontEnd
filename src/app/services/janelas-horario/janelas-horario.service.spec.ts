import { TestBed } from '@angular/core/testing';

import { JanelasHorarioService } from './janelas-horario.service';

describe('JanelasHorarioService', () => {
  let service: JanelasHorarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JanelasHorarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
