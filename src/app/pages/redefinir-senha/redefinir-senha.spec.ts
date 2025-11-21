import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { RedefinirSenha } from './redefinir-senha';

describe('RedefinirSenha', () => {
  let component: RedefinirSenha;
  let fixture: ComponentFixture<RedefinirSenha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RedefinirSenha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedefinirSenha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
