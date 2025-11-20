import type { TemplateRef} from '@angular/core';
import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import type { FormArray, FormGroup} from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import type { Sala } from '../../../models/sala.model';

@Component({
  selector: 'app-editar-espaco-modal',
  standalone: false,
  templateUrl: './editar-espaco-modal.html',
  styleUrl: './editar-espaco-modal.css'
})
export class EditarEspacoModal {
  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);

  @ViewChild('editarEspacoModalTemplate')
  modalTemplate!: TemplateRef<any>;

  @Output() clickEdit = new EventEmitter<Sala>();
  @Output() clickCancel = new EventEmitter<void>();

  form!: FormGroup;
  private salaId!: number;
  
  get materiasArray(): FormArray {
    return this.form.get('materias') as FormArray;
  }

  public open(sala: Sala): void {
  this.salaId = sala.salaId;

  this.form = this.fb.group({
    salaNome: [sala.salaNome ?? '', Validators.required],
    capacidade: [sala.capacidade ?? 0, Validators.required],
    piso: [sala.piso ?? 0, Validators.required],
    disponibilidade: [sala.disponibilidade ?? false],
    tipoSala: [sala.tipoSala ?? '', Validators.required],
    materias: this.fb.array([]),
    observacoes: [sala.observacoes ?? '']
  });

  const materias = Array.isArray(sala.materias) ? sala.materias : [];
  materias.forEach(m => this.materiasArray.push(this.fb.control(m)));

  this.form.disable();

  this.modalService.open(this.modalTemplate, {
    backdrop: 'static',
    centered: true,
    size: 'lg',
  });
}

  public onModalEdit(): void {
    this.form.enable();
  }

  public onModalSave(): void {
    if (this.form.invalid) {return}

    this.form.enable();

    const updatedData: Sala = {
      salaId: this.salaId, 
      ...this.form.value,
      materias: this.materiasArray.value
    };

    this.clickEdit.emit(updatedData);
    this.modalService.dismissAll();
  }

  public onModalClose(): void {
    this.clickCancel.emit();
    this.modalService.dismissAll();
  }

  public addMateriaByName(value: string): void {
    const nome = value.trim();
    if (!nome) {return};

    this.materiasArray.push(this.fb.control(nome));
  }

  public removeMateria(index: number): void {
    this.materiasArray.removeAt(index);
  }

}
