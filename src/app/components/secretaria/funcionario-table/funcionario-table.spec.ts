import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { FuncionarioTable } from './funcionario-table';

describe('FuncionarioTable', () => {
  let component: FuncionarioTable;
  let fixture: ComponentFixture<FuncionarioTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FuncionarioTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionarioTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
