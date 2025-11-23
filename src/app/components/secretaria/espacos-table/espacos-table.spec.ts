import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { EspacosTable } from './espacos-table';

describe('EspacosTable', () => {
  let component: EspacosTable;
  let fixture: ComponentFixture<EspacosTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EspacosTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspacosTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
