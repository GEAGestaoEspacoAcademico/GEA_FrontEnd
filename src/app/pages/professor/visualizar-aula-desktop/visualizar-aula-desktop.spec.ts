import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { VisualizarAulaDesktop } from './visualizar-aula-desktop';

describe('VisualizarAulaDesktop', () => {
  let component: VisualizarAulaDesktop;
  let fixture: ComponentFixture<VisualizarAulaDesktop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisualizarAulaDesktop],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizarAulaDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
