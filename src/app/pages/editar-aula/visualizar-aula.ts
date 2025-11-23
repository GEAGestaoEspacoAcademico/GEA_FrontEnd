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
        )
      )
    );
  }

  private loadDataAndBuildForm(): void {
    if (!this.currentUser || !this.agendamentoAtual) { return; }

    forkJoin({
      disciplinas: this.professorService.getDisciplinasDoProfessor(this.currentUser.usuarioId),
      cursos: this.cursoService.getCursos(),
      salas: this.salaService.getSalas()
    }).pipe(
      take(1)
    ).subscribe({
      next: ({ disciplinas, cursos, salas }) => {
        this.cursoIdAtual = cursos.find(c => c.nomeCurso === this.agendamentoAtual?.curso)?.id;
        this.salaIdAtual = salas.find(s => s.salaNome === this.agendamentoAtual?.nomeSala)?.salaId;

        const disciplinaOptions = disciplinas.map(d => ({ label: d.disciplinaNome, value: d.disciplinaId }));
        const cursoOptions = cursos.map(c => ({ label: c.nomeCurso, value: c.id }));
        const salaOptions = salas.filter(s => s.disponibilidade === true || s.salaId === this.salaIdAtual).map(s => ({ label: s.salaNome, value: s.salaId }));

        this.formFields = this.createFormFields(
          this.agendamentoAtual!,
          disciplinaOptions,
          cursoOptions,
          salaOptions
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
  }

  onFormSubmit(formData: Record<string, any>): void {
    if (!this.agendamentoAtual || !this.currentUser) {
      console.error("Dados do agendamento original não encontrados. Não é possível atualizar.");
      return;
    }

    const novaData = new Date(`${formData['data']}T12:00:00Z`);
    const novoDiaDaSemana = novaData.toLocaleDateString('pt-BR', { weekday: 'long' });

    const agendamentoAtualizado: EditAgendamento = {
      dataInicio: formData['data'],
      dataFim: formData['data'],
      diaDaSemana: novoDiaDaSemana,
      horaInicio: FormatUtils.normalizeHour(formData['horario'].split('-')[0]),
      horaFim: FormatUtils.normalizeHour(formData['horario'].split('-')[1]),
      disciplinaId: Number(formData['disciplinaId']),
      salaId: Number(formData["salaId"]),
    };
    this.store.dispatch(AgendamentoActions.editAgendamento({ id: this.agendamentoAtual.id, agendamento: agendamentoAtualizado }));
    this.router.navigate(['/aulas']);
    console.log("Agendamento salvo: ", agendamentoAtualizado)
    this.notificationService.showSuccess("Agendamento alterado com sucesso")
  }

  onScheduleSubmitAttempt(formData: Record<string, any>): void {
    this.pendingFormData = formData;
    this.confirmModal.open();
  }

  onConfirmSubmit(): void {
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
