import type { OnInit} from '@angular/core';
import { Component, effect, inject, input, output } from '@angular/core';
import {
  type AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  type FormGroup,
  type ValidatorFn,
  Validators,
} from '@angular/forms';
import type { JanelaHorario } from '../../../models/janelasHorario.model';
import type { Sala } from '../../../models/sala.model';
import type { Disciplina } from '../../../models/disciplina.model';
import { FormatUtils } from '../../../utils/format.utils';

@Component({
  selector: 'app-recurring-scheduling-form',
  standalone: false,
  templateUrl: './recurring-scheduling-form.html',
  styleUrl: './recurring-scheduling-form.css',
})
export class RecurringSchedulingForm implements OnInit{
  formatarTempo(inicio: string, fim: string): string {
    return FormatUtils.formatTime(inicio, fim);
  }

  private fb = inject(FormBuilder);

  disciplinas = input<Disciplina[]>([]);
  locais = input<Sala[]>([]);
  horarios = input<JanelaHorario[]>([]);
  isLoading = input<boolean>(false);
  scheduleSubmit = output<SchedulingFormValue>();
  localChange = output<number | null>();

  listDisciplinas: Disciplina[] = [];
  listLocais: Sala[] = [];
  dataMinima: string = ''

  form: FormGroup = this.fb.group({
    disciplina: ['', Validators.required],
    local: ['', Validators.required],
    horarios: this.fb.array([], this.minSelectedCheckboxes(1)),
    dataInicio: ['', Validators.required],
    dataFim: ['', Validators.required],
  });

  get horariosFormArray(): FormArray {
    return this.form.get('horarios') as FormArray;
  }

  constructor() {
    effect(() => {
      const lista = this.horarios();
      this.horariosFormArray.clear();
      lista.forEach(() => this.horariosFormArray.push(new FormControl(false)));
    });

    this.form.get('local')?.valueChanges.subscribe((valor) => {
      this.localChange.emit(valor);
    });
  }
  ngOnInit(): void {
    const hoje = new Date();
    this.dataMinima = hoje.toISOString().split('T')[0];
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.scheduleSubmit.emit(this.form.value as SchedulingFormValue);
    }
  }

  get isValid() {
    return this.form.valid;
  }

  private minSelectedCheckboxes(min: number): ValidatorFn {
    return (fa: AbstractControl) => {
      if (!(fa instanceof FormArray)) {
        return null;
      }
      const count = fa.controls.filter((c) => c.value).length;
      return count >= min ? null : { required: min, actual: count };
    };
  }
}

interface SchedulingFormValue {
  disciplina: number;
  local: number;
  horarios: boolean[];
}
