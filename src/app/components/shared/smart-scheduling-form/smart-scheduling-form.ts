import type { OnInit } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, type FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { JanelasHorarioService } from '../../../services/janelas-horario/janelas-horario.service';
import type { JanelaHorario } from '../../../models/janelasHorario.model';
import { CursoService } from '../../../services/curso/curso.service';
import type { Curso } from '../../../models/curso.model';
import type { Sala } from '../../../models/sala.model';
import type { Disciplina } from '../../../models/disciplina.model';
import { SalaService } from '../../../services/salas/sala.service';
import { DisciplinaService } from '../../../services/disciplina/disciplina.service';

@Component({
  selector: 'app-smart-scheduling-form',
  standalone: false,
  templateUrl: './smart-scheduling-form.html',
  styleUrl: './smart-scheduling-form.css'
})
export class SmartSchedulingForm implements OnInit {

  // --- Propriedades de Entrada (Inputs) ---
  private _singleDate: Date | null = null; // Propriedade interna para armazenar o valor
  horarios: string[] = [];
  cursos: Curso[] = [];
  salas: Sala[] = [];
  disciplinas: Disciplina[] = [];

  horariosDisponiveisInicio: string[] = [];
  horariosDisponiveisFim: string[] = [];

  // 💡 NOVO: Setter para detectar mudanças na data e chamar o carregamento dos horários
  @Input()
  set singleDate(date: Date | null) {
    console.log("DATA RECEBIDA: ", date)
    this._singleDate = date;

    if (this._singleDate) {
      this.getHorariosDisponiveis(this._singleDate);
    } else {
      if (this.aulaForm) {
        this.horarios = [];
        this.aulaForm.get('horario')?.setValue('');
      }
    }
  }

  get singleDate(): Date | null {
    return this._singleDate;
  }
  @Input() mode: 'aula' | 'evento' = 'aula';
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
  private serviceHorario = inject(JanelasHorarioService);
  private serviceCurso = inject(CursoService);
  private serviceSala = inject(SalaService);
  private serviceDisciplina = inject(DisciplinaService);

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
    this.buildForms(); // Chama a função para inicializar os formulários.
    this.getCursosProfessor();
    this.getDisciplinas();
    this.getSalas();
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

    // Emite o evento com os dados de agendamento.
    this.scheduleSubmit.emit(payload);

    setTimeout(() => {
      this.aulaForm.reset();
    }, 2000);
  }

  // --- Lógica de Adicionar Configuração para Agendamento em Lote (Evento) ---
  addEventoConfig() {
    // Verifica se o formulário de evento é inválido.
    if (this.eventoForm.invalid) { return };

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

  getHorariosDisponiveis(date: Date): void {
    // 1. Garante que a data está no formato correto (AAAA-MM-DD)
    const dataString = date.toISOString().substring(0, 10);

    this.serviceHorario.getHorariosDisponiveisPorData(dataString).subscribe({
      next: (janelas: JanelaHorario[]) => {
        console.log("Janelas", janelas)
        // 2. Mapeia o retorno da API para o formato de string esperado (ex: '07:40 - 9:20')
        this.horarios = janelas.map(janela => {
          // Assumindo que: janela.horaInicio é uma string (ex: "07:40:00")
          const inicioFormatado = janela.horaInicio.substring(0, 5); // Pega "07:40"
          const fimFormatado = janela.horaFim.substring(0, 5);      // Pega "09:20"
          return `${inicioFormatado} - ${fimFormatado}`;
        });

        this.horariosDisponiveisInicio = janelas.map(janela =>
          janela.horaInicio.substring(0, 5)
        );

        this.horariosDisponiveisFim = janelas.map(janela =>
          janela.horaFim.substring(0, 5)
        );
      },
      error: (err) => {
        console.error("Erro ao buscar horários", err);
        this.horarios = []; // Limpa a lista em caso de erro
        this.horariosDisponiveisInicio = [];
        this.horariosDisponiveisFim = [];
      }
    });
  }

  getCursosProfessor() {
    this.serviceCurso.getCursos().subscribe({
      next: (cursos: Curso[]) => {
        this.cursos = cursos;
      },
      error: (err) => {
        console.error("Erro ao buscar cursos", err);
        this.cursos = [];
      }
    });
  }

  getDisciplinas() {
    this.serviceDisciplina.getDisciplinas().subscribe({
      next: (disciplinas: Disciplina[]) => {
        this.disciplinas = disciplinas;
      },
      error: (err) => {
        console.error("Erro ao buscar disciplinas", err);
        this.disciplinas = [];
      }
    });
  }

  getSalas() {
    this.serviceSala.getSalas().subscribe({
      next: (salas: Sala[]) => {
        this.salas = salas;
      },
      error: (err) => {
        console.error("Erro ao buscar salas", err);
        this.salas = [];
      }
    });
  }

}