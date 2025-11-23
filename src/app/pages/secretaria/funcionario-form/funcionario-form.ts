import { CommonModule } from '@angular/common';
import {  Component ,EventEmitter, inject, Input, Output } from '@angular/core';
import type { OnInit } from '@angular/core';

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
  disciplinaDigitada = '';

  disciplinasDisponiveis = [
    'Gestão de Projetos (ADS)',
    'Inglês (AMS)'

  ];

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.form = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.required],
      registro: ['', Validators.required],
      perfil: ['', Validators.required],
      disciplinas: this.fb.array([])
    });

    this.form.get('perfil')?.valueChanges.subscribe((perfil) => {
      const emailCtrl = this.form.get('email');

      if (!emailCtrl) return;

      if (perfil === 'PROFESSOR') {
        emailCtrl.setValidators([Validators.required, Validators.email]);
      } else {
        emailCtrl.setValidators([Validators.required]);
        this.disciplinas.clear();
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
    this.disciplinaDigitada = '';
  }

  confirmarDisciplina(): void {
    let nomeFinal = '';

    if (this.disciplinaTemp === 'OUTRA') {
      nomeFinal = this.disciplinaDigitada.trim();
    } else {
      nomeFinal = this.disciplinaTemp.trim();
    }

    if (nomeFinal.length > 0) {
      const jaExiste = this.disciplinas.value.some(
        (n: string) => n.toLowerCase() === nomeFinal.toLowerCase()
      );

      if (!jaExiste) {
        this.disciplinas.push(this.fb.control(nomeFinal));
      }
    }

    this.modalDisciplinaAberto = false;
  }

  removeDisciplina(i: number): void {
    this.disciplinas.removeAt(i);
  }

  campoInvalido(nome: string): boolean {
    const c = this.form.get(nome);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  onSave(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.saveForm.emit(this.form);
    }
  }

  onCancel(): void {
    this.cancelForm.emit();
  }
}
