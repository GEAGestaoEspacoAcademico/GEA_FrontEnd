import type { OnInit } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {FormBuilder, FormGroup}  from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-smart-scheduling-form',
  standalone: false, 
  templateUrl: './smart-scheduling-form.html',
  styleUrl: './smart-scheduling-form.css'
})
export class SmartSchedulingForm implements OnInit {

  // --- Propriedades de Entrada (Inputs) ---
  // Define o modo de operação do formulário: 'aula' para agendamento individual, 'evento' para agendamento em lote.
  @Input() mode: 'aula' | 'evento' = 'aula';
  // Recebe uma única data para agendamento no modo 'aula'. O '!' indica que será inicializada externamente.
  @Input() singleDate!: Date;
  // Recebe um array de datas para agendamento em lote no modo 'evento'.
  @Input() dateArray: Date[] = [];


  // --- Propriedades de Saída (Outputs) ---
  // Emite um objeto (any) com os dados de um agendamento único (modo 'aula').
  @Output() scheduleSubmit = new EventEmitter<any>();
  // Emite um array de objetos (any[]) com os dados de agendamentos em lote (modo 'evento').
  @Output() batchSubmit = new EventEmitter<any[]>();

  // --- Injeção de Dependência (Método Moderno: inject()) ---
  // Injeta o serviço FormBuilder para construir e gerenciar os objetos FormGroup.
  // Esta é a forma preferencial no Angular moderno, atendendo às regras do ESLint como 'prefer-inject'.
  private fb = inject(FormBuilder);

  // --- Propriedades do Formulário ---
  // Objeto FormGroup para o agendamento de aulas (modo 'aula').
  aulaForm!: FormGroup;
  // Objeto FormGroup para a configuração de eventos (modo 'evento').
  eventoForm!: FormGroup;

  // Array que armazena a configuração de eventos (eventos) antes da submissão em lote.
  eventBatch: any[] = [];

  // --- Ciclo de Vida do Componente ---
  // Método chamado após a inicialização das propriedades de Input.
  ngOnInit(): void {
    console.log(" Input recebido (dateArray):", this.dateArray);
    this.buildForms(); // Chama a função para inicializar os formulários.
  }

  // --- Lógica de Inicialização dos Formulários ---
  buildForms() {
    // Inicializa o formulário de Aula com controles e validadores.
    this.aulaForm = this.fb.group({
      horario: ['', Validators.required], // Campo obrigatório
      local: ['', Validators.required],
      disciplina: ['', Validators.required],
      solicitante: ['', Validators.required]
    });

    // Inicializa o formulário de Evento com controles e validadores.
    this.eventoForm = this.fb.group({
      nomeEvento: ['', Validators.required],
      local: ['', Validators.required],
      inicio: ['', Validators.required],
      fim: ['', Validators.required],
      // Campo booleano para indicar se a configuração se aplica a todos os horários (presumivelmente).
      todosHorarios: [false] 
    });
  }

  // --- Lógica de Submissão de Formulário Único (Aula) ---
  submitAula() {
    // Verifica se o formulário é inválido (se há campos obrigatórios faltando).
    if (this.aulaForm.invalid) { return };

    // Cria o payload de dados combinando os valores do formulário com a data única recebida.
    const payload = {
      ...this.aulaForm.value,
      date: this.singleDate
    };

    console.log(this.aulaForm);

    // Emite o evento com os dados de agendamento.
    this.scheduleSubmit.emit(payload);
    this.aulaForm.reset(); // Limpa o formulário após a submissão.
  }

  // --- Lógica de Adicionar Configuração para Agendamento em Lote (Evento) ---
  addEventoConfig() {
    // Verifica se o formulário de evento é inválido.
    if (this.eventoForm.invalid) { return };

    console.log(" EventoForm válido?", this.eventoForm.valid);
    console.log(" Valores do eventoForm:", this.eventoForm.value);
    console.log(" dateArray recebido:", this.dateArray);

    const config = this.eventoForm.value;

    // Itera sobre o array de datas recebido (dateArray) e cria um objeto de evento para cada data.
    // Usa '?? []' para garantir que dateArray é um array e evitar erros se for null/undefined.
    (this.dateArray ?? []).forEach(date => {
      this.eventBatch.push({ // Adiciona a configuração de evento ao array de lote.
        date,
        nomeEvento: config.nomeEvento,
        local: config.local,
        inicio: config.inicio,
        fim: config.fim,
        todosHorarios: config.todosHorarios
      });
    });

    console.log(" Evento gerado para push:", this.eventBatch);
    console.log(this.dateArray);

    this.eventoForm.reset(); // Limpa o formulário de configuração para a próxima entrada.
  }

  // --- Lógica de Gerenciamento do Lote ---
  // Remove um item do array de lote (eventBatch) com base no índice.
  removeBatchItem(index: number) {
    this.eventBatch.splice(index, 1);
  }

  // --- Lógica de Submissão de Lote (Evento) ---
  submitBatch() {
    // Verifica se o lote está vazio.
    if (this.eventBatch.length === 0) { return };
    // Verifica se o número de itens no lote corresponde ao número de datas (lógica de validação do batch).
    if (this.eventBatch.length !== this.dateArray.length) { return }; 

    // Emite o array completo de agendamentos em lote.
    this.batchSubmit.emit(this.eventBatch);
    this.eventoForm.reset(); // Limpa o formulário após a submissão.
  }

}