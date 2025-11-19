import type { Field } from '../../components/shared/scheduling/types';
import type { OnInit} from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import type { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';
import { SalaService } from '../../services/salas/sala.service';
import type { Observable} from 'rxjs';
import { filter, forkJoin, switchMap, take } from 'rxjs';
import { ProfessorService } from '../../services/professor/professor.service';
import type { Option } from '../../components/shared/scheduling/types';
import { Store } from '@ngrx/store';
import { selectUserCargo, selectUserId } from '../../store/auth/auth.selectors';
import type { RecomendacaoRequest, SalasRecomendadas } from '../../types/recomendacao';
import { RecursoService } from '../../services/recurso/recurso.service';
import type { AgendarForm, CriarAgendamento } from '../../types/agendar';
import { TipoSalaService } from '../../services/tipo-sala/tipo-sala.service';
import { JanelasHorarioService } from '../../services/janelas-horario/janelas-horario.service';
import { FormatUtils } from '../../utils/format.utils';
import { AgendamentoService } from '../../services/agendamentos/agendamento.service';
import { SnackBarService } from '../../services/snackbar/snackbar.service';
import { Data } from '@angular/router';

@Component({
  selector: 'app-agenda',
  standalone: false,
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda implements OnInit{
  private tiposSalaService = inject(TipoSalaService)
  private salaService = inject(SalaService)
  private professorService = inject(ProfessorService)
  private recursosService = inject(RecursoService)
  private janelasHorarioService = inject(JanelasHorarioService)
  private agendamentoService = inject(AgendamentoService)
  private snackbarService = inject(SnackBarService)
  private store = inject(Store)
  
  @ViewChild('sucessModal') sucessModal!: ConfirmationModal;
  @ViewChild('classInfoModal') classInfoModal!: ConfirmationModal;

  cargo$: Observable<string | undefined> = this.store.select(selectUserCargo);
  
  requisicaoRecomendacao!: RecomendacaoRequest
  isloading: boolean = false;
  isRecomendacaoLoading: boolean = false
  submittedData!: AgendarForm;
  formFields: Field[] | undefined;
  salasRecomendadas: SalasRecomendadas[] = []
  idSalaRecomendadaAtual!: number

  ngOnInit(): void {
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
        tipoSalas: this.tiposSalaService.getTiposSalas(),
        recursos: this.recursosService.getRecursos(),
        janelasHorario: this.janelasHorarioService.getJanelasHorario()
      });
      })
    ).subscribe({
      next: ({disciplinas, cursos, tipoSalas, recursos, janelasHorario}) => {
        const disciplinaOptions = disciplinas.map(d => ({ label: d.nomeDisciplina, value: d.idDisciplina }));
        const cursoOptions = cursos.map(c => ({ label: c.nome, value: c.idCurso }));
        const tiposSalaOptions = tipoSalas.map(ts => ({ label: ts.tipoSalaNome, value: ts.tipoSalaId }));
        
        const recursoOptions = recursos.map(r => ({label: r.nome, value: r.id}))
        const janelaHorarioOptions = janelasHorario.map(jh => {
          const hi = FormatUtils.formatHour(jh.horaInicio);
          const hf = FormatUtils.formatHour(jh.horaFim);
          return(
            {label: `${hi}-${hf}`, value: jh.id}
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
      janelaHorarioOptions:Option[]      
    ): Field[] {
      return [
        {
          name: 'data',
          label: 'Data',
          type: 'date',
          defaultValue: FormatUtils.formatDateForInput(new Date()),
          validators: { required: true, errorMessages: { required: 'A data é obrigatória.' } }
        },
        {
          name: 'qtdAulas',
          label: 'Qtd de aulas',
          type: 'select',
          options:[
            {label: '1 Aula', value: 1},
            {label: '2 Aulas', value: 2},
            {label: '3 Aulas', value: 3},
            {label: '4 Aulas', value: 4},
            {label: '5 Aulas', value: 5},
            {label: '6 Aulas', value: 6},
          ],
          validators: {required: true, errorMessages: {required: 'Quantidade de aulas é obrigatório'}}
        },
        {
          name: 'janelaHorarioId',
          label: 'Horario',
          type: 'select',
          options: janelaHorarioOptions,
          validators: { required: true, errorMessages: { required: 'O horário é obrigatório.' } }
        },
        {
          name: 'cursoId', 
          label: 'Curso',
          type: 'select',
          options: cursoOptions, 
          validators: { required: true, errorMessages: { required: 'O curso é obrigatório.' } }
        },
        {
          name: 'disciplinaId',
          label: 'Disciplina',
          type: 'select',
          options: disciplinaOptions,
          validators: { required: true, errorMessages: { required: 'O campo disciplina é obrigatório.' } }
        },
        {
          name: 'localId', 
          label: 'Local',
          type: 'select',
          options: tiposSalaOptions,
          validators: { required: true, errorMessages: { required: 'A seleção da sala é obrigatória.' } }
        },
        {
          name: 'capacidade',
          label: 'Capacidade',
          type: 'select',
          options: [
            {label: '10-20 alunos', value: 20},
            {label: '20-30 alunos', value: 30},
            {label: '30+', value: 40}
          ]
        },
        {
          name: 'recursos',
          label: 'Recursos',
          type: 'equipment-select',
          options: recursoOptions
        }
      ];
  }

  criarRequisicaoParaRecomendacao(formData: AgendarForm){
    //TODO: COLOCAR DINÂMICO QUANDO /recomendacao FOR ADAPTADO
    const recursosIds = formData.recursos.map(r => r.id);
    this.requisicaoRecomendacao = {
      capacidade: Number(formData.capacidade),
      data: formData.data,
      horarios: {
        horaFim: '7:40',
        horaInicio: '9:20'
      },
      recursosIds,
      tipoSalaId: Number(formData.localId)
    }
  }

  handleFormSubmit(formData: any): void {
    this.submittedData = formData;
    this.criarRequisicaoParaRecomendacao(formData)
    this.buscarRecomendacoes()
  }

  buscarRecomendacoes(){
    this.isRecomendacaoLoading = true;
    this.salaService.getRecomendacao(this.requisicaoRecomendacao).subscribe({
      next: (data) => {
        this.salasRecomendadas = data;
        this.isRecomendacaoLoading = false;
      },
      error: e => {
        console.error(e)
        this.snackbarService.showError("Erro ao buscar salas recomendadas");
        this.isRecomendacaoLoading = false;
      }
    })
  }

  openInfoModal(id: number) {
    this.idSalaRecomendadaAtual = id
    this.classInfoModal.open();
  }

agendarAula() {
  this.store.select(selectUserId).pipe(
    filter(Boolean),
    take(1),
    switchMap(userId => {
      const corpoCriarAgendamento: CriarAgendamento = {
        usuarioId: userId,
        salaId: Number(this.idSalaRecomendadaAtual),
        disciplinaId: Number(this.submittedData.disciplinaId),
        dataInicio: this.submittedData.data,
        dataFim: this.submittedData.data,
        janelasHorarioId: this.submittedData.janelaHorarioId,
        tipo: 'Aula',
        diaDaSemana: 'Segunda' 
      };
      return this.agendamentoService.criarAgendamento(corpoCriarAgendamento);
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
