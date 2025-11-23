import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { CadastroSala } from './cadastro-sala';

describe('CadastroSala', () => {
  let component: CadastroSala;
  let fixture: ComponentFixture<CadastroSala>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastroSala]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroSala);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
