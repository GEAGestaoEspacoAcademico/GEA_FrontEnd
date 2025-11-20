import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEspacos } from './lista-espacos';

describe('ListaEspacos', () => {
  let component: ListaEspacos;
  let fixture: ComponentFixture<ListaEspacos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaEspacos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaEspacos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
