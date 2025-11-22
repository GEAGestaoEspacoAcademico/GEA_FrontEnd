import type { OnInit} from "@angular/core";
import { Component, inject, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import type { Observable} from "rxjs";
import { filter, take, switchMap, forkJoin } from "rxjs";
import type { ConfirmationModal } from "../../../components/modals/confirmation-modal/confirmation-modal";
import type { Field } from "../../../components/shared/scheduling/types";
import { AgendamentoService } from "../../../services/agendamento/agendamento.service";
import { HeaderTitleService } from "../../../services/header-title/header-title.service";
import { JanelasHorarioService } from "../../../services/janelas-horario/janelas-horario.service";
import { ProfessorService } from "../../../services/professor/professor.service";
import { RecursoService } from "../../../services/recurso/recurso.service";
import { SalaService } from "../../../services/sala/sala.service";
import { SnackBarService } from "../../../services/snackbar/snackbar.service";
import { TipoSalaService } from "../../../services/tipo-sala/tipo-sala.service";
import { selectUserCargo, selectUserId } from "../../../store/auth/auth.selectors";
import type { AgendamentoAulaCriarRequest } from "../../../types/agendamentoAula.type";
import type { AgendarForm } from "../../../types/agendar";
import type { BuscarRecomendacaoRequest, BuscarRecomendacaoResponse } from "../../../types/sala.type";
import { FormatUtils } from "../../../utils/format.utils";
import type { Option } from "../../../types/utils.types"

@Component({
  selector: 'app-agenda',
  standalone: false,
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda implements OnInit {
  private tiposSalaService = inject(TipoSalaService);
  private salaService = inject(SalaService);
  private professorService = inject(ProfessorService);
  private recursosService = inject(RecursoService);
  private janelasHorarioService = inject(JanelasHorarioService);
  private agendamentoService = inject(AgendamentoService);
  private snackbarService = inject(SnackBarService);
  private store = inject(Store);
  private headerService = inject(HeaderTitleService);

  @ViewChild('sucessModal') sucessModal!: ConfirmationModal;
  @ViewChild('classInfoModal') classInfoModal!: ConfirmationModal;

  cargo$: Observable<string | undefined> = this.store.select(selectUserCargo);
  
  requisicaoRecomendacao!: BuscarRecomendacaoRequest
  isloading: boolean = false;
  isRecomendacaoLoading: boolean = false;
  submittedData!: AgendarForm;
  formFields: Field[] | undefined;
  salasRecomendadas: BuscarRecomendacaoResponse[] = []
  idSalaRecomendadaAtual!: number

  ngOnInit(): void {
    this.headerService.setTitle('Agenda');
    this.headerService.hideBack();
    this.loadDataAndBuildForm();
  }

  private loadDataAndBuildForm(): void {
    this.isloading = true;
    this.store.select(selectUserId).pipe(
      filter(Boolean),
      take(1),
      switchMap(userId => {
        return forkJoin({
        disciplinas: this.professorService.getDisciplinasDoProfessor(userId),
        cursos: this.professorService.getCursosDoProfessor(userId),
        tipoSalas: this.tiposSalaService.getTiposSala(),
        recursos: this.recursosService.getRecursos(),
        janelasHorario: this.janelasHorarioService.getJanelasHorario()
      });
      })
    ).subscribe({
      next: ({disciplinas, cursos, tipoSalas, recursos, janelasHorario}) => {
        const disciplinaOptions = disciplinas.map(d => ({ label: d.disciplinaNome, value: d.disciplinaId }));
        const cursoOptions = cursos.map(c => ({ label: c.cursoNome, value: c.cursoId }));
        const tiposSalaOptions = tipoSalas.map(ts => ({ label: ts.tipoSalaNome, value: ts.tipoSalaId }));
        
        const recursoOptions = recursos.map(r => ({label: r.nome, value: r.id}))
        const janelaHorarioOptions = janelasHorario.map(jh => {
          const hi = FormatUtils.formatHour(jh.horaInicio);
          const hf = FormatUtils.formatHour(jh.horaFim);
          return(
            {label: `${hi}-${hf}`, value: jh.janelasHorarioId}
          )
        })
        this.isloading = false;
        this.formFields = this.createFormFields(
          disciplinaOptions,
          cursoOptions,
          tiposSalaOptions,
          recursoOptions,
          janelaHorarioOptions
        );
      },
      error: (err) => {
        console.error('Falha ao carregar dados do formulário:', err);
        this.isloading = false;
      }
    })
  }

  private createFormFields(
    disciplinaOptions: Option[],
    cursoOptions: Option[],
    tiposSalaOptions: Option[],
    recursoOptions: Option[],
    janelaHorarioOptions: Option[],
  ): Field[] {
    return [
      {
        name: 'data',
        label: 'Data',
        type: 'date',
        defaultValue: FormatUtils.formatDateForInput(new Date()),
        validators: { required: true, errorMessages: { required: 'A data é obrigatória.' } },
      },
      {
        name: 'qtdAulas',
        label: 'Qtd de aulas',
        type: 'select',
        options: [
          { label: '1 Aula', value: 1 },
          { label: '2 Aulas', value: 2 },
          { label: '3 Aulas', value: 3 },
          { label: '4 Aulas', value: 4 },
          { label: '5 Aulas', value: 5 },
          { label: '6 Aulas', value: 6 },
        ],
        validators: {
          required: true,
          errorMessages: { required: 'Quantidade de aulas é obrigatório' },
        },
      },
      {
        name: 'janelaHorarioId',
        label: 'Horario',
        type: 'select',
        options: janelaHorarioOptions,
        validators: { required: true, errorMessages: { required: 'O horário é obrigatório.' } },
      },
      {
        name: 'cursoId',
        label: 'Curso',
        type: 'select',
        options: cursoOptions,
        validators: { required: true, errorMessages: { required: 'O curso é obrigatório.' } },
      },
      {
        name: 'disciplinaId',
        label: 'Disciplina',
        type: 'select',
        options: disciplinaOptions,
        validators: {
          required: true,
          errorMessages: { required: 'O campo disciplina é obrigatório.' },
        },
      },
      {
        name: 'localId',
        label: 'Local',
        type: 'select',
        options: tiposSalaOptions,
        validators: {
          required: true,
          errorMessages: { required: 'A seleção da sala é obrigatória.' },
        },
      },
      {
        name: 'capacidade',
        label: 'Capacidade',
        type: 'select',
        options: [
          { label: '10-20 alunos', value: 20 },
          { label: '20-30 alunos', value: 30 },
          { label: '30+', value: 40 },
        ],
      },
      {
        name: 'recursos',
        label: 'Recursos',
        type: 'equipment-select',
        options: recursoOptions,
      },
    ];
  }

  criarRequisicaoParaRecomendacao(formData: AgendarForm) {
    //TODO: COLOCAR DINÂMICO QUANDO /recomendacao FOR ADAPTADO
    const recursosIds = formData.recursos.map((r) => r.id);
    this.requisicaoRecomendacao = {
      capacidade: Number(formData.capacidade),
      data: formData.data,
      horarios: {
        horaFim: '7:40',
        horaInicio: '9:20',
      },
      recursosIds,
      tipoSalaId: Number(formData.localId),
    };
  }

  handleFormSubmit(formData: any): void {
    this.submittedData = formData;
    this.criarRequisicaoParaRecomendacao(formData);
    this.buscarRecomendacoes();
  }

  buscarRecomendacoes() {
    this.isRecomendacaoLoading = true;
    this.salaService.getRecomendacao(this.requisicaoRecomendacao).subscribe({
      next: (data) => {
        this.salasRecomendadas = data;
        this.isRecomendacaoLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.snackbarService.showError('Erro ao buscar salas recomendadas');
        this.isRecomendacaoLoading = false;
      },
    });
  }

  openInfoModal(id: number) {
    this.idSalaRecomendadaAtual = id;
    this.classInfoModal.open();
  }

agendarAula() {
  this.store.select(selectUserId).pipe(
    filter(Boolean),
    take(1),
    switchMap(userId => {
      const corpoCriarAgendamento: AgendamentoAulaCriarRequest = {
        usuarioId: userId,
        salaId: Number(this.idSalaRecomendadaAtual),
        disciplinaId: Number(this.submittedData.disciplinaId),
        data: this.submittedData.data,
        janelasHorarioId: this.submittedData.janelaHorarioId,
        isEvento: false,
        quantidade: Number(this.submittedData.qtdAulas)
      };
      return this.agendamentoService.criarAgendamentoAula(corpoCriarAgendamento);
    })
  ).subscribe({
    next: (_) => {
      this.snackbarService.showSuccess("Agendamento feito com sucesso");
    },
    error: (err) => {
      console.error("Erro ao criar agendamento:", err);
      this.snackbarService.showError("Falha ao agendar. Tente novamente.");
    }
  });
}
}
