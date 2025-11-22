import { Component, effect, inject, input, output } from '@angular/core';
import { type AbstractControl, FormArray, FormBuilder, FormControl, type FormGroup, type ValidatorFn, Validators } from '@angular/forms';
import type { JanelaHorario } from '../../../models/janelasHorario.model';
import type { Sala } from '../../../models/sala.model';
import type { Disciplina } from '../../../models/disciplina.model';
import type { SalaOpcao } from '../../../pages/secretaria/agendar-sala-materia/test';

@Component({
  selector: 'app-recurring-scheduling-form',
  standalone: false,
  templateUrl: './recurring-scheduling-form.html',
  styleUrl: './recurring-scheduling-form.css'
})
export class RecurringSchedulingForm {
  // private fb = inject(FormBuilder);

  // disciplinas = input<Disciplina[]>([]);
  // locais = input<Sala[]>([]);
  // horarios = input<JanelaHorario[]>([]);
  // isLoading = input<boolean>(false);

  // scheduleSubmit = output<SchedulingFormValue>();

  // form: FormGroup = this.fb.group({
  //   disciplina: ['', Validators.required],
  //   local: ['', Validators.required],
  //   horarios: this.fb.array([], this.minSelectedCheckboxes(1))
  // });

  // get horariosFormArray(): FormArray {
  //   return this.form.get('horarios') as FormArray;
  // }

  // constructor() {
  //   effect(() => {
  //     const newHorarios = this.horarios();
  //     this.updateHorariosFormArray(newHorarios);
  //   }, { allowSignalWrites: true });
  // }

  // updateHorariosFormArray(janelas: JanelaHorario[]): void {
  //   while (this.horariosFormArray.length !== 0) {
  //     this.horariosFormArray.removeAt(0);
  //   }

  //   janelas.forEach(() => {
  //     this.horariosFormArray.push(new FormControl(false));
  //   });

  //   this.horariosFormArray.updateValueAndValidity();
  // }

  // minSelectedCheckboxes(min: number = 1): ValidatorFn {
  //   return (formArray: AbstractControl): Record<string, any> | null => {
  //     if (!(formArray instanceof FormArray)) {return null};

  //     const selectedCount = formArray.controls
  //       .map(control => control.value) 
  //       .reduce((prev, next) => next ? prev + 1 : prev, 0); 

  //     return selectedCount >= min ? null : { 'minSelected': { required: min, actual: selectedCount } };
  //   };
  // }

  // formatTime(inicio: string, fim: string): string {
  //   return `${inicio} - ${fim}`;
  // }

  // onSubmit(): void {
  //   this.form.markAllAsTouched();

  //   if (this.form.valid) {
  //     this.scheduleSubmit.emit(this.form.value as SchedulingFormValue);
  //   } else {
  //     console.error('Formulário inválido. Verifique os campos obrigatórios.');
  //   }
  // }

  formatTime(inicio: string, fim: string): string {
    return `${inicio} - ${fim}`;
  }

  private fb = inject(FormBuilder);

  disciplinas = input<Disciplina[]>([]);
  locais = input<SalaOpcao[]>([]);
  
  horarios = input<JanelaHorario[]>([]);
  isLoading = input<boolean>(false);
  scheduleSubmit = output<SchedulingFormValue>();

  listDisciplinas: Disciplina[] = [];
  listLocais: Sala[] = [];

  form: FormGroup = this.fb.group({
    disciplina: ['', Validators.required],
    local: ['', Validators.required],
    horarios: this.fb.array([], this.minSelectedCheckboxes(1))
  });

  get horariosFormArray(): FormArray { return this.form.get('horarios') as FormArray; }

  constructor() {
    effect(() => {
      const lista = this.horarios();
      this.horariosFormArray.clear();
      lista.forEach(() => this.horariosFormArray.push(new FormControl(false)));
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {this.scheduleSubmit.emit(this.form.value as SchedulingFormValue);}
  }
  
  get isValid() { return this.form.valid; }

  private minSelectedCheckboxes(min: number): ValidatorFn {
    return (fa: AbstractControl) => {
      if (!(fa instanceof FormArray)) {return null;}
      const count = fa.controls.filter(c => c.value).length;
      return count >= min ? null : { required: min, actual: count };
    };
  }
}

interface SchedulingFormValue {
  disciplina: number;
  local: number;      
  horarios: boolean[];
}
