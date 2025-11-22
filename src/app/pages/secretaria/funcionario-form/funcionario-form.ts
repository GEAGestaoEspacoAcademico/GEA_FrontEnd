import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-funcionario-form',
  standalone: false,
  templateUrl: './funcionario-form.html',
  styleUrl: './funcionario-form.css'
})
export class FuncionarioForm implements OnInit {
  @Input() isLoading: boolean = false;
  @Output() save = new EventEmitter<FormGroup>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  modalDisciplinaAberto = false;
  disciplinaTemp = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: [''],
      registro: ['', Validators.required],
      perfil: ['', Validators.required],
      disciplinas: this.fb.array([]),
    });

    this.form.get('perfil')?.valueChanges.subscribe((perfil) => {
      const emailCtrl = this.form.get('email');
      if (!emailCtrl) return;

      if (perfil === 'PROFESSOR') {
        emailCtrl.setValidators([Validators.required, Validators.email]);
      } else if (perfil === 'SECRETARIA' || perfil === 'AUXILIAR_DOCENTE') {
        emailCtrl.setValidators([Validators.required]);
      }

      emailCtrl.updateValueAndValidity();
    });
  }

  get disciplinas(): FormArray {
    return this.form.get('disciplinas') as FormArray;
  }

  abrirModalDisciplina() {
    this.modalDisciplinaAberto = true;
    this.disciplinaTemp = '';
  }

  confirmarDisciplina() {
    if (this.disciplinaTemp.trim().length > 0) {
      this.disciplinas.push(this.fb.control(this.disciplinaTemp));
    }
    this.modalDisciplinaAberto = false;
  }

  removeDisciplina(i: number) {
    this.disciplinas.removeAt(i);
  }

  onSave() {
    if (this.form.valid) {
      this.save.emit(this.form);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}