import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { EditarEspacoModal } from './editar-espaco-modal';

describe('EditarEspacoModal', () => {
  let component: EditarEspacoModal;
  let fixture: ComponentFixture<EditarEspacoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarEspacoModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarEspacoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
