import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { CursosTable } from './cursos-table';

describe('CursosTable', () => {
  let component: CursosTable;
  let fixture: ComponentFixture<CursosTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CursosTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
