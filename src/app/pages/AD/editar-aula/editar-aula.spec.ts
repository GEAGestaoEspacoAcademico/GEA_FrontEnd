import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { EditarAula } from './visualizar-aula';

describe('VisualizarAula', () => {
  let component: EditarAula;
  let fixture: ComponentFixture<EditarAula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarAula],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarAula);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
