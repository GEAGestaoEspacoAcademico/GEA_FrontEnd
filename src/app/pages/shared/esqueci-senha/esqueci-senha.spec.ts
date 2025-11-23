import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { EsqueciSenha } from './esqueci-senha';

describe('RedefinirSenha', () => {
  let component: EsqueciSenha;
  let fixture: ComponentFixture<EsqueciSenha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EsqueciSenha],
    }).compileComponents();

    fixture = TestBed.createComponent(EsqueciSenha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
