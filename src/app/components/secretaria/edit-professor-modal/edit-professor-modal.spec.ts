import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfessorModal } from './edit-professor-modal';

describe('EditProfessorModal', () => {
  let component: EditProfessorModal;
  let fixture: ComponentFixture<EditProfessorModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditProfessorModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfessorModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
