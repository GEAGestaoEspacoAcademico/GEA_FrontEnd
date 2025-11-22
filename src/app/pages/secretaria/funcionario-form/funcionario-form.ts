import { CommonModule } from '@angular/common';
import {  Component ,EventEmitter, inject, Input, Output } from '@angular/core';
import type { OnInit } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';

import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import type { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './funcionario-form.html',
  styleUrls: ['./funcionario-form.css']
})
export class FuncionarioForm implements OnInit {

  @Input() isLoading = false;

  @Output() saveForm = new EventEmitter<FormGroup>();
  @Output() cancelForm = new EventEmitter<void>();

  form!: FormGroup;
  modalDisciplinaAberto = false;
  disciplinaTemp = '';

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.form = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: [''],
      registro: ['', Validators.required],
      perfil: ['', Validators.required],
      disciplinas: this.fb.array([])
    });

    this.form.get('perfil')?.valueChanges.subscribe((perfil) => {
      const emailCtrl = this.form.get('email');
      
      if (!emailCtrl) {
        return;
      }

      if (perfil === 'PROFESSOR') {
        emailCtrl.setValidators([Validators.required, Validators.email]);
      } else {
        emailCtrl.setValidators([Validators.required]);
      }

      emailCtrl.updateValueAndValidity();
    });
  }

  get disciplinas(): FormArray {
    return this.form.get('disciplinas') as FormArray;
  }

  abrirModalDisciplina(): void {
    this.modalDisciplinaAberto = true;
    this.disciplinaTemp = '';
  }

  confirmarDisciplina(): void {
    if (this.disciplinaTemp.trim().length > 0) {
      this.disciplinas.push(this.fb.control(this.disciplinaTemp));
    }
    this.modalDisciplinaAberto = false;
  }

  removeDisciplina(i: number): void {
    this.disciplinas.removeAt(i);
  }

  onSave(): void {
    if (this.form.valid) {
      this.saveForm.emit(this.form);
    }
  }

  onCancel(): void {
    this.cancelForm.emit();
  }
}