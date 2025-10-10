import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Configuracoes } from './configuracoes';

describe('Configuracoes', () => {
  let component: Configuracoes;
  let fixture: ComponentFixture<Configuracoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Configuracoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Configuracoes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
