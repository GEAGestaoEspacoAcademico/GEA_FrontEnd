import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notificacoes } from './notificacoes';

describe('Notificacoes', () => {
  let component: Notificacoes;
  let fixture: ComponentFixture<Notificacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Notificacoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Notificacoes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
