import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-smart-scheduling-form',
  standalone: false,
  templateUrl: './smart-scheduling-form.html',
  styleUrl: './smart-scheduling-form.css'
})
export class SmartSchedulingForm implements OnInit {

  @Input() mode: 'aula' | 'evento' = 'aula';
  @Input() singleDate!: Date;
  @Input() dateArray: Date[] = [];


  @Output() scheduleSubmit = new EventEmitter<any>();
  @Output() batchSubmit = new EventEmitter<any[]>();

  aulaForm!: FormGroup;
  eventoForm!: FormGroup;

  eventBatch: any[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    console.log("📥 Input recebido (dateArray):", this.dateArray);
    this.buildForms();
  }

  buildForms() {
    this.aulaForm = this.fb.group({
      horario: ['', Validators.required],
      local: ['', Validators.required],
      disciplina: ['', Validators.required],
      solicitante: ['', Validators.required]
    });

    this.eventoForm = this.fb.group({
      nomeEvento: ['', Validators.required],
      local: ['', Validators.required],
      inicio: ['', Validators.required],
      fim: ['', Validators.required],
      todosHorarios: [false]
    });
  }

  submitAula() {
    if (this.aulaForm.invalid) { return };

    const payload = {
      ...this.aulaForm.value,
      date: this.singleDate
    };

    console.log(this.aulaForm);

    this.scheduleSubmit.emit(payload);
    this.aulaForm.reset();
  }

  addEventoConfig() {
    if (this.eventoForm.invalid) { return };

    console.log("✔ EventoForm válido?", this.eventoForm.valid);
    console.log("📝 Valores do eventoForm:", this.eventoForm.value);
    console.log("📅 dateArray recebido:", this.dateArray);

    const config = this.eventoForm.value;

    // Garante que this.dateArray é um array antes de chamar forEach
    (this.dateArray ?? []).forEach(date => {
      this.eventBatch.push({
        date,
        nomeEvento: config.nomeEvento,
        local: config.local,
        inicio: config.inicio,
        fim: config.fim,
        todosHorarios: config.todosHorarios
      });
    });

    console.log("📦 Evento gerado para push:", this.eventBatch);

    console.log(this.dateArray);

    this.eventoForm.reset();
  }

  removeBatchItem(index: number) {
    this.eventBatch.splice(index, 1);
  }

  submitBatch() {
    if (this.eventBatch.length === 0) { return };
    if (this.eventBatch.length !== this.dateArray.length) { return };

    this.batchSubmit.emit(this.eventBatch);
    this.eventoForm.reset();
  }

}
