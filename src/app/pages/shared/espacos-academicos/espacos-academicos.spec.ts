import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { EspacosAcademicos } from './espacos-academicos';

describe('EspacosAcademicos', () => {
  let component: EspacosAcademicos;
  let fixture: ComponentFixture<EspacosAcademicos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EspacosAcademicos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspacosAcademicos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
