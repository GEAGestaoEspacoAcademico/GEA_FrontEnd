import type { OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, type FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { JanelasHorarioService } from '../../../services/janelas-horario/janelas-horario.service';
import type { JanelaHorario } from '../../../models/janelasHorario.model';
import { CursoService } from '../../../services/curso/curso.service';
import type { Curso } from '../../../models/curso.model';
import type { Sala } from '../../../models/sala.model';
import type { Disciplina } from '../../../models/disciplina.model';
import { DisciplinaService } from '../../../services/disciplina/disciplina.service';
import { SalaService } from '../../../services/sala/sala.service';
import type { CriarEventoFormulario } from '../../../types/agendamentoEvento.type';
import { FormatUtils } from '../../../utils/format.utils';
import type { CriarAgendamentoAulaFormulario } from '../../../types/util.types';
import type { JanelasHorarioPorDataRequest } from '../../../types/janelaHorario.type';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-smart-scheduling-form',
  standalone: false,
  templateUrl: './smart-scheduling-form.html',
  styleUrl: './smart-scheduling-form.css',
})
export class SmartSchedulingForm implements OnInit {
  private fb = inject(FormBuilder);
  private serviceHorario = inject(JanelasHorarioService);
  private serviceCurso = inject(CursoService);
  private serviceSala = inject(SalaService);
  private serviceDisciplina = inject(DisciplinaService);
  private cdr = inject(ChangeDetectorRef);
  private snackBarService = inject(SnackBarService)

  private _singleDate: Date | null = null;
  private _dateArray: Date[] = [];

  horarios: string[] = [];
  listaHorarios: JanelaHorario[] = [];
  cursos: Curso[] = [];
  salas: Sala[] = [];
  disciplinas: Disciplina[] = [];

  horariosDisponiveisInicio: string[] = [];
  horariosDisponiveisFim: string[] = [];

  aulaForm!: FormGroup;
  eventoForm!: FormGroup;
  eventBatch: any[] = [];

  @Input() mode: 'aula' | 'evento' = 'aula';

  @Input()
  set singleDate(date: Date | null) {
    this._singleDate = date;

    if (this._singleDate) {
      this.buscarJanelasHorario();
    } else {
      this.limparSelecoesDeHorario();
    }
  }

  get singleDate(): Date | null {
    return this._singleDate;
  }

  @Input()
  set dateArray(values: Date[]) {
    this._dateArray = values || [];
    if (this._dateArray.length > 0) {
      this.buscarJanelasHorario();
    } else {
      this.listaHorarios = [];
    }
  }

  get dateArray(): Date[] {
    return this._dateArray;
  }

  @Output() scheduleSubmit = new EventEmitter<CriarAgendamentoAulaFormulario>();
  @Output() batchSubmit = new EventEmitter<CriarEventoFormulario[]>();

  ngOnInit(): void {
    this.buildForms();
    this.setupListeners();
    this.carregarDadosAuxiliares();
  }
  verificarPreRequisitos(): void {
    const temSingle = !!this.singleDate;
    const temArray = this.dateArray && this.dateArray.length > 0;

    if (!temSingle && !temArray) {
      this.snackBarService.showError("Por favor, selecione uma data no calendário primeiro.")
      
      this.aulaForm.get('local')?.setValue(null, { emitEvent: false });
      this.eventoForm.get('local')?.setValue(null, { emitEvent: false });
    }
  }

  buildForms() {
    this.aulaForm = this.fb.group({
      inicio: ['', Validators.required],
      fim: ['', Validators.required],
      local: ['', Validators.required],
      disciplina: ['', Validators.required],
      solicitante: ['', Validators.required],
    });

    this.eventoForm = this.fb.group({
      nomeEvento: ['', Validators.required],
      local: ['', Validators.required],
      inicio: ['', Validators.required],
      fim: ['', Validators.required],
    });
  }

  setupListeners() {
    this.aulaForm.get('local')?.valueChanges.subscribe(() => {
      this.buscarJanelasHorario();
    });

    this.eventoForm.get('local')?.valueChanges.subscribe(() => {
      this.buscarJanelasHorario();
    });

    this.aulaForm.get('inicio')?.valueChanges.subscribe((horarioInicio) => {
      this.atualizarHorariosFim(horarioInicio, 'aula');
    });

    this.eventoForm.get('inicio')?.valueChanges.subscribe((horarioInicio) => {
      this.atualizarHorariosFim(horarioInicio, 'evento');
    });
  }

  carregarDadosAuxiliares() {
    this.getCursosProfessor();
    this.getDisciplinas();
    this.getSalas();
  }

  formatarHorario(horario: string) {
    if (horario === null || horario === '') {
      return '';
    }
    return FormatUtils.formatHour(horario);
  }

  buscarJanelasHorario(): void {
    if (!this.aulaForm || !this.eventoForm) {
      return;
    }

    let dataReferencia: Date | null = null;

    if (this._singleDate) {
      dataReferencia = this._singleDate;
    } else if (this._dateArray && this._dateArray.length > 0) {
      dataReferencia = this._dateArray[0];
    }
    let salaId = null;

    if (this.mode === 'aula') {
      salaId = this.aulaForm.get('local')?.value;
    } else if (this.mode === 'evento') {
      salaId = this.eventoForm.get('local')?.value;
    }

    if (!dataReferencia || !salaId) {
      this.listaHorarios = [];
      this.horariosDisponiveisInicio = []; 
      this.horariosDisponiveisFim = [];
      return;
    }

    const dataString = dataReferencia.toISOString().substring(0, 10);

    const buscarJanelaHorarioRequest: JanelasHorarioPorDataRequest = {
      data: dataString,
      salaId,
    };

    this.serviceHorario.getJanelaHorarioPorData(buscarJanelaHorarioRequest).subscribe({
      next: (janelas: JanelaHorario[]) => {
        this.listaHorarios = janelas || [];
        const iniciosUnicos = new Set(janelas.map((j) => j.horaInicio));
        this.horariosDisponiveisInicio = Array.from(iniciosUnicos).sort();

        this.horariosDisponiveisFim = [];
      },
      error: (err) => {
        console.error('Erro ao buscar janelas', err);
        this.listaHorarios = [];
        this.horariosDisponiveisInicio = []; 
        this.horariosDisponiveisFim = [];
      },
    });
  }

  getHorariosDisponiveis(date: Date): void {
    this._singleDate = date;
    this.buscarJanelasHorario();
  }

  limparSelecoesDeHorario() {
    if (this.aulaForm || this.eventoForm) {
      this.horarios = [];
      this.horariosDisponiveisInicio = [];
      this.horariosDisponiveisFim = [];
      this.aulaForm?.get('horario')?.setValue('');
      this.eventoForm?.get('inicio')?.setValue('');
      this.eventoForm?.get('fim')?.setValue('');
      this.listaHorarios = [];
    }
  }

  submitAula() {
    if (this.aulaForm.invalid) {
      return;
    }

    const payload = {
      ...this.aulaForm.value,
      date: this.singleDate,
    };

    this.scheduleSubmit.emit(payload);

    setTimeout(() => {
      this.aulaForm.reset();
      this.listaHorarios = [];
    }, 2000);
  }

  addEventoConfig() {
    if (this.eventoForm.invalid) {
      return;
    }

    const temArray = this.dateArray && this.dateArray.length > 0;
    const temSingle = !!this.singleDate;

    if (!temArray && !temSingle) {
      console.warn('Nenhuma data selecionada para adicionar o evento.');
      return;
    }

    const config = this.eventoForm.value;

    if (temArray) {
      this.dateArray.forEach((data) => {
        this.eventBatch.push({
          date: data,
          nomeEvento: config.nomeEvento,
          local: config.local,
          inicio: config.inicio,
          fim: config.fim,
          todosHorarios: config.todosHorarios,
        });
      });
    } else if (temSingle) {
      this.eventBatch.push({
        date: this.singleDate,
        nomeEvento: config.nomeEvento,
        local: config.local,
        inicio: config.inicio,
        fim: config.fim,
        todosHorarios: config.todosHorarios,
      });
    }

    this.eventoForm.reset();
  }

  removeBatchItem(index: number) {
    this.eventBatch.splice(index, 1);
  }

  submitBatch() {
    if (this.eventBatch.length === 0) {
      return;
    }
    const payloadAgrupado: CriarEventoFormulario[] = [];

    this.eventBatch.forEach((item) => {
      let grupoExistente = payloadAgrupado.find(
        (g) => g.eventoNome === item.nomeEvento && g.salaId === Number(item.local),
      );

      if (!grupoExistente) {
        grupoExistente = {
          eventoNome: item.nomeEvento,
          salaId: Number(item.local),
          dias: [],
        };
        payloadAgrupado.push(grupoExistente);
      }

      const dataFormatada = FormatUtils.formatDateForInput(new Date(item.date));

      grupoExistente.dias.push({
        dia: dataFormatada,
        horaInicio: item.inicio,
        horaFim: item.fim,
      });
    });

    this.batchSubmit.emit(payloadAgrupado);

    this.eventBatch = [];
    this.eventoForm.reset();
  }

  getCursosProfessor() {
    this.serviceCurso.getCursos().subscribe({
      next: (cursos: Curso[]) => {
        this.cursos = cursos || [];
      },
      error: () => {
        this.cursos = [];
      },
    });
  }

  getDisciplinas() {
    this.serviceDisciplina.getDisciplinas().subscribe({
      next: (disciplinas: Disciplina[]) => {
        this.disciplinas = disciplinas || [];
      },
      error: () => {
        this.disciplinas = [];
      },
    });
  }

  getSalas() {
    this.serviceSala.getSalas().subscribe({
      next: (salas: Sala[]) => {
        this.salas = salas || [];
      },
      error: () => {
        this.salas = [];
      },
    });
  }
  atualizarHorariosFim(inicioSelecionado: string, modo: 'aula' | 'evento') {
    if (!inicioSelecionado) {
      this.horariosDisponiveisFim = [];
      return;
    }

    const todosFins = this.listaHorarios.map((j) => j.horaFim);
    const finsValidos = todosFins.filter((fim) => fim > inicioSelecionado);
    this.horariosDisponiveisFim = Array.from(new Set(finsValidos)).sort();

    const form = modo === 'aula' ? this.aulaForm : this.eventoForm;
    const fimAtual = form.get('fim')?.value;

    if (fimAtual && fimAtual <= inicioSelecionado) {
      form.get('fim')?.setValue('');
    }

    this.cdr.detectChanges();
  }
}
