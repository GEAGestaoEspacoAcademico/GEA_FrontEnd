import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarSalaMateria } from './agendar-sala-materia';

describe('AgendarSalaMateria', () => {
  let component: AgendarSalaMateria;
  let fixture: ComponentFixture<AgendarSalaMateria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendarSalaMateria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendarSalaMateria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
