import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, forkJoin, map, Subject, switchMap, take, takeUntil, tap, type Observable } from 'rxjs';
import type { Agendamento, EditAgendamento } from '../../models/agendamento.model';
import { selectAgendamentoLoading, selectAulaById } from '../../store/agendamento/agendamento.selectors';
import { Store } from '@ngrx/store';
import { AgendamentoActions } from '../../store/agendamento/agendamento.actions';
import type { Field } from '../../components/shared/scheduling/types';
import type { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';
import { DisciplinaService } from '../../services/disciplina/disciplina.service';
import { CursoService } from '../../services/curso/curso.service';
import type { User } from '../../models/user.model';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { SalaService } from '../../services/salas/sala.service';
import type { Option } from '../../components/shared/scheduling/types'
import { SnackBarService } from '../../services/snackbar/snackbar.service';
import { FormatUtils } from '../../utils/format.utils';
import ProfessorService from '../../services/professor/professor.service';

@Component({
  selector: 'app-editar-aula',
  standalone: false,
  templateUrl: './editar-aula.html',
  styleUrl: './editar-aula.css'
})
export class EditarAula implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private store = inject(Store)
  private professorService = inject(ProfessorService)
  private cursoService = inject(CursoService)
  private salaService = inject(SalaService)
  private notificationService = inject(SnackBarService)

  @ViewChild('confirmModal') confirmModal!: ConfirmationModal;

  aula$!: Observable<Agendamento | undefined>;
  loading$: Observable<boolean> = this.store.select(selectAgendamentoLoading);
  private destroy$ = new Subject<void>();
  currentUser: User | null = null;
  salaIdAtual: number | undefined = undefined;
  cursoIdAtual: number | undefined = undefined;


  aulaId: string | null = null;
  agendamentoAtual: Agendamento | null = null;
  pendingFormData: Record<string, any> | null = null;
  formFields!: Field[];

  ngOnInit(): void {
    this.store.select(selectCurrentUser).pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.currentUser = user || null;
    });
    this.aula$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      filter(id => !!id),
      switchMap(id =>
        this.store.select(selectAulaById(id)).pipe(
          tap(aula => {
            if (!aula) {
              this.store.dispatch(AgendamentoActions.loadAgendamentoById({ id }));
            } else if (!this.agendamentoAtual) {
              this.agendamentoAtual = aula;
              this.loadDataAndBuildForm();
            }
          })
  import type { OnInit } from '@angular/core';
  import { Component, inject, ViewChild } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { filter, forkJoin, map, Subject, switchMap, take, takeUntil, tap, type Observable } from 'rxjs';
  import { selectAgendamentoLoading, selectAulaById } from '../../store/agendamento/agendamento.selectors';
  import { Store } from '@ngrx/store';
  import { AgendamentoActions } from '../../store/agendamento/agendamento.actions';
  import type { Field } from '../../components/shared/scheduling/types';
  import type { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';
  import { CursoService } from '../../services/curso/curso.service';
  import type { Usuario } from '../../models/usuario.model';
  import { selectCurrentUser } from '../../store/auth/auth.selectors';
  import { SalaService } from '../../services/sala/sala.service';
  import type {Option} from '../../components/shared/scheduling/types'
  import { SnackBarService } from '../../services/snackbar/snackbar.service';
  import { FormatUtils } from '../../utils/format.utils';
import { ProfessorService } from '../../services/professor/professor.service';
import type { AgendamentoAula } from '../../models/agendamentoAula.model';
import type { Agendamento } from '../../models/agendamento.model';
import type { AgendamentoAulaEditarRequest } from '../../types/agendamentoAula.type';
import { JanelasHorarioService } from '../../services/janelas-horario/janelas-horario.service';
import type { AgendarForm } from '../../types/agendar';
import { AgendamentoService } from '../../services/agendamento/agendamento.service';

  @Component({
    selector: 'app-editar-aula',
    standalone: false,
    templateUrl: './editar-aula.html',
    styleUrl: './editar-aula.css'
  })
  export class EditarAula implements OnInit{
    private route = inject(ActivatedRoute)
    private router = inject(Router)
    private store = inject(Store)
    private professorService = inject(ProfessorService)
    private cursoService = inject(CursoService)
    private salaService = inject(SalaService)
    private notificationService = inject(SnackBarService)
    private janelaHorarioService = inject(JanelasHorarioService)
    private agendamentoService = inject(AgendamentoService)
    private destroy$ = new Subject<void>();

    @ViewChild('confirmModal') confirmModal!: ConfirmationModal;
    
    aula$!: Observable<AgendamentoAula | undefined>;
    loading$: Observable<boolean> = this.store.select(selectAgendamentoLoading);
    currentUser: Usuario | null = null;
    salaIdAtual: number | undefined = undefined;
    cursoIdAtual: number | undefined = undefined;

    aulaId: string | null = null;
    agendamentoAtual: AgendamentoAula | null = null;
    pendingFormData: Record<string, string>  | null = null;
    formFields!: Field[];

    ngOnInit(): void {
      this.store.select(selectCurrentUser).pipe(
        takeUntil(this.destroy$)
      ).subscribe(user => {
        this.currentUser = user || null; 
      });
      this.aula$ = this.route.paramMap.pipe(
        map(params => Number(params.get('id'))),
        filter(id => !!id),
        switchMap(id => 
          this.store.select(selectAulaById(id)).pipe(
            tap(aula => {
              if (!aula) {
                this.store.dispatch(AgendamentoActions.loadAgendamentoById({ id }));
              }else if(!this.agendamentoAtual){
                this.agendamentoAtual = aula;
                this.loadDataAndBuildForm();
              }
            })
          )
        )
      )
    );
  }

  private loadDataAndBuildForm(): void {
    if (!this.currentUser || !this.agendamentoAtual) { return; }

    forkJoin({
      disciplinas: this.professorService.getDisciplinasDoProfessor(this.currentUser.usuarioId),
      cursos: this.cursoService.getCursos(),
      salas: this.salaService.getSalas(),
      janelasHorario: this.janelaHorarioService.getJanelaHorarioPorData(this.agendamentoAtual.data)
    }).pipe(
      take(1)
    ).subscribe({
      next: ({ disciplinas, cursos, salas }) => {
        this.cursoIdAtual = cursos.find(c => c.nomeCurso === this.agendamentoAtual?.curso)?.id;
        this.salaIdAtual = salas.find(s => s.salaNome === this.agendamentoAtual?.nomeSala)?.salaId;

        const disciplinaOptions = disciplinas.map(d => ({ label: d.nomeDisciplina, value: d.idDisciplina }));
        const cursoOptions = cursos.map(c => ({ label: c.nomeCurso, value: c.id }));
        const salaOptions = salas.filter(s => s.disponibilidade === true || s.salaId === this.salaIdAtual).map(s => ({ label: s.salaNome, value: s.salaId }));
      next: ({ disciplinas, cursos, salas, janelasHorario }) => {
        this.cursoIdAtual = cursos.find(c => c.cursoNome === this.agendamentoAtual?.cursoNome)?.cursoId;
        this.salaIdAtual = salas.find(s => s.salaNome === this.agendamentoAtual?.salaNome)?.salaId;
        
        const disciplinaOptions = disciplinas.map(d => ({ label: d.disciplinaNome, value: d.disciplinaId }));
        const cursoOptions = cursos.map(c => ({ label: c.cursoNome, value: c.cursoId }));
        const salaOptions = salas.filter(s => s.disponibilidade === true || s.salaId === this.salaIdAtual ).map(s => ({ label: s.salaNome, value: s.salaId }));
        const janelaHorarioOptions = janelasHorario.map(jh => ({label: `${jh.horaInicio} - ${jh.horaFim}`, value: jh.janelasHorarioId}))

        this.formFields = this.createFormFields(
          this.agendamentoAtual!,
          disciplinaOptions,
          cursoOptions,
          salaOptions,
          janelaHorarioOptions
        );
      },
      error: (err) => {
        console.error('Falha ao carregar dados do formulário:', err);
      }
    });
  }

  private createFormFields(
    agendamento: Agendamento,
    disciplinaOptions: Option[],
    cursoOptions: Option[],
    salaOptions: Option[]
  ): Field[] {
    return [
      {
        name: 'disciplinaId',
        label: 'Disciplina',
        type: 'select',
        defaultValue: agendamento.disciplinaId,
        options: disciplinaOptions,
        validators: { required: true, errorMessages: { required: 'O campo disciplina é obrigatório.' } }
      },
      {
        name: 'data',
        label: 'Data',
        type: 'date',
        defaultValue: FormatUtils.formatDateForInput(agendamento.dataInicio),
        validators: { required: true, errorMessages: { required: 'A data é obrigatória.' } }
      },
      {
        name: 'horario',
        label: 'Horário',
        type: 'select',
        defaultValue: (`${FormatUtils.formatHour(agendamento.horaInicio)}-${FormatUtils.formatHour(agendamento.horaFim)}`),
        options: [
          { label: '7:40-9:20', value: '7:40-9:20' },
          { label: '9:30-11:10', value: '9:30-11:10' },
          { label: '11:20-13:00', value: '11:20-13:00' },
        ],
        validators: { required: true, errorMessages: { required: 'O horário é obrigatório.' } }
      },
      {
        name: 'salaId',
        label: 'Local',
        type: 'select',
        defaultValue: this.salaIdAtual,
        options: salaOptions,
        validators: { required: true, errorMessages: { required: 'A seleção da sala é obrigatória.' } }
      },
      {
        name: 'cursoId',
        label: 'Curso',
        type: 'select',
        defaultValue: this.cursoIdAtual,
        options: cursoOptions,
        validators: { required: true, errorMessages: { required: 'O curso é obrigatório.' } }
      },
      {
        name: "semestre",
        label: "Semestre",
        type: "select",
        defaultValue: agendamento.semestre,
        options: [
          { label: "2024.1", value: "2024.1" },
          { label: "2024.2", value: "2024.2" },
          { label: "2025.1", value: "2025.1" },
          { label: "2025.2", value: "2025.2" },
          { label: "2026.1", value: "2026.1" },
          { label: "2026.2", value: "2026.2" },
        ]
      }
    ];
      agendamentoAulaAtual: AgendamentoAula,
      disciplinaOptions: Option[], 
      cursoOptions: Option[],      
      tiposSalaOptions: Option[],
      janelaHorarioOptions:Option[]      
    ): Field[] {
      return [
        {
          name: 'data',
          label: 'Data',
          type: 'date',
          defaultValue: FormatUtils.formatDateForInput(agendamentoAulaAtual.data),
          validators: { required: true, errorMessages: { required: 'A data é obrigatória.' } }
        },
        //!PRECISA QUE O AGENDAMENTOAULA TENHA O JANELAHORARIO ID
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
          defaultValue: agendamentoAulaAtual.disciplinaId,
          validators: { required: true, errorMessages: { required: 'O curso é obrigatório.' } }
        },
        {
          name: 'disciplinaId',
          label: 'Disciplina',
          type: 'select',
          defaultValue: agendamentoAulaAtual.disciplinaId,
          options: disciplinaOptions,
          validators: { required: true, errorMessages: { required: 'O campo disciplina é obrigatório.' } }
        },
        {
          name: 'localId', 
          label: 'Local',
          type: 'select',
          options: tiposSalaOptions,
          defaultValue: this.salaIdAtual,
          validators: { required: true, errorMessages: { required: 'A seleção da sala é obrigatória.' } }
        },
      ];
  }

  onFormSubmit(formData: Record<string, string>): void {
    if (!this.agendamentoAtual || !this.currentUser) {
      console.error("Dados do agendamento original não encontrados. Não é possível atualizar.");
      return;
    }

    const agendamentoAtualizado: AgendamentoAulaEditarRequest = {
      data: formData['data'],
      disciplinaId: Number(formData['disciplinaId']),
      isEvento: false,
      janelasHorarioId: Number(formData['janelaHorarioId']),
      quantidade: Number(formData['qtdAulas']),
      salaId: Number(formData['localId']),
      usuarioId: this.currentUser.usuarioId
    };
    this.store.dispatch(AgendamentoActions.editAgendamento({ id: this.agendamentoAtual.id, agendamento: agendamentoAtualizado }));
    this.router.navigate(['/aulas']);
    console.log("Agendamento salvo: ", agendamentoAtualizado)
    this.notificationService.showSuccess("Agendamento alterado com sucesso")
    console.log("Corpo para editar: ", agendamentoAtualizado)
    this.agendamentoService.editAgendamentoAula(this.agendamentoAtual.agendamentoAulaId,agendamentoAtualizado).subscribe({
      next: () => {
        this.router.navigate(['/aulas']);
        console.log("Agendamento salvo: ", agendamentoAtualizado)
        this.notificationService.showSuccess("Agendamento alterado com sucesso")
      },
      error: (err) => {
        this.notificationService.showError("Erro ao alterar agendamento")
        console.error(err)
      }
    })
  }

  onScheduleSubmitAttempt(formData: Record<string, string>): void {
    this.pendingFormData = formData;
    this.confirmModal.open();
    console.log("Editar: ", this.pendingFormData)
    this.confirmModal.open(); 
  }

  onConfirmSubmit(): void {
    console.log("Confirmar agendamento: ", this.pendingFormData)
    if (this.pendingFormData) {
      this.onFormSubmit(this.pendingFormData);
      this.pendingFormData = null;
    } else {
      console.error("Confirmação de submit sem dados pendentes.");
    }
  }

  confirmCancel(): void {
    this.pendingFormData = null;
  }
}
