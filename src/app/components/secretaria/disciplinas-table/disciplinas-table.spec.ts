import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { DisciplinasTable } from './disciplinas-table';

describe('DisciplinasTable', () => {
  let component: DisciplinasTable;
  let fixture: ComponentFixture<DisciplinasTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisciplinasTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisciplinasTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
