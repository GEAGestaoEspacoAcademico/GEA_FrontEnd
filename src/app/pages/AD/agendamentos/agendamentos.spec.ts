import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Agendamentos } from './agendamentos';

describe('Agendamentos', () => {
  let component: Agendamentos;
  let fixture: ComponentFixture<Agendamentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Agendamentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Agendamentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
