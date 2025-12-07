import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { VisualizarAula } from './visualizar-aula';

describe('VisualizarAula', () => {
  let component: VisualizarAula;
  let fixture: ComponentFixture<VisualizarAula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisualizarAula],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizarAula);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
