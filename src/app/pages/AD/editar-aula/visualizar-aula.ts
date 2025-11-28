import type { JanelasHorarioPorDataRequest } from './../../../types/janelaHorario.type';
import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  filter,
  forkJoin,
  map,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  type Observable,
} from 'rxjs';
import { Store } from '@ngrx/store';
import type { Field } from '../../../components/shared/scheduling/types';
import type { ConfirmationModal } from '../../../components/modals/confirmation-modal/confirmation-modal';
import { CursoService } from '../../../services/curso/curso.service';
import type { Usuario } from '../../../models/usuario.model';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { SalaService } from '../../../services/sala/sala.service';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { FormatUtils } from '../../../utils/format.utils';
import type { AgendamentoAula } from '../../../models/agendamentoAula.model';
import type { AgendamentoAulaEditarRequest } from '../../../types/agendamentoAula.type';
import { JanelasHorarioService } from '../../../services/janelas-horario/janelas-horario.service';
import { AgendamentoService } from '../../../services/agendamento/agendamento.service';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import ProfessorService from '../../../services/professor/professor.service';
import type { Option } from '../../../types/utils.types';

@Component({
  selector: 'app-editar-aula',
  standalone: false,
  templateUrl: './editar-aula.html',
  styleUrl: './editar-aula.css',
})
export class EditarAula implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly professorService = inject(ProfessorService);
  private readonly cursoService = inject(CursoService);
  private readonly salaService = inject(SalaService);
  private readonly notificationService = inject(SnackBarService);
  private readonly janelaHorarioService = inject(JanelasHorarioService);
  private readonly agendamentoService = inject(AgendamentoService);
  private readonly headerService = inject(HeaderTitleService);
  private readonly destroy$ = new Subject<void>();

  @ViewChild('confirmModal') confirmModal!: ConfirmationModal;

  loading: boolean = false;
  currentUser: Usuario | null = null;
  salaIdAtual: number | undefined = undefined;
  cursoIdAtual: number | undefined = undefined;

  aulaId: string | null = null;
  agendamentoAtual: AgendamentoAula | null = null;
  pendingFormData: Record<string, string> | null = null;
  formFields!: Field[];

  ngOnInit(): void {
    this.headerService.setTitle('Editar Aula');
    this.headerService.showBack();
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user || null;
      });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarAgendamento(id);
  }

  carregarAgendamento(agendamentoId: number) {
    this.loading = true;
    this.agendamentoService.getAgendamentoAulaPorId(agendamentoId).subscribe({
      next: (agendamento) => {
        this.agendamentoAtual = agendamento;
        this.loading = false;
        this.loadDataAndBuildForm();
      },
    });
  }

  private loadDataAndBuildForm(): void {
    if (!this.currentUser || !this.agendamentoAtual) {
      return;
    }

    const requisicao: JanelasHorarioPorDataRequest = {
      data: this.agendamentoAtual.data,
      salaId: this.agendamentoAtual.salaId,
    };

    forkJoin({
      disciplinas: this.professorService.getDisciplinasDoProfessor(this.currentUser.usuarioId),
      cursos: this.cursoService.getCursos(),
      salas: this.salaService.getSalas(),
      janelasHorario: this.janelaHorarioService.getJanelaHorarioPorData(requisicao),
    })
      .pipe(take(1))
      .subscribe({
        next: ({ disciplinas, cursos, salas, janelasHorario }) => {
          this.cursoIdAtual = cursos.find(
            (c) => c.cursoNome === this.agendamentoAtual?.cursoNome,
          )?.cursoId;
          this.salaIdAtual = salas.find(
            (s) => s.salaNome === this.agendamentoAtual?.salaNome,
          )?.salaId;

          const disciplinaOptions = disciplinas.map((d) => ({
            label: d.disciplinaNome,
            value: d.disciplinaId,
          }));

          const cursoOptions = cursos.map((c) => ({ label: c.cursoNome, value: c.cursoId }));

          const salaOptions = salas
            .filter((s) => s.disponibilidade === true || s.salaId === this.salaIdAtual)
            .map((s) => ({ label: s.salaNome, value: s.salaId }));

          const janelaHorarioOptions = janelasHorario.map((jh) => ({
            label: `${jh.horaInicio} - ${jh.horaFim}`,
            value: jh.janelasHorarioId,
          }));

          this.formFields = this.createFormFields(
            this.agendamentoAtual!,
            disciplinaOptions,
            cursoOptions,
            salaOptions,
            janelaHorarioOptions,
          );
        },
        error: (err) => {
          console.error('Falha ao carregar dados do formulário:', err);
        },
      });
  }

  private createFormFields(
    agendamentoAulaAtual: AgendamentoAula,
    disciplinaOptions: Option[],
    cursoOptions: Option[],
    tiposSalaOptions: Option[],
    janelaHorarioOptions: Option[],
  ): Field[] {
    return [
      {
        name: 'data',
        label: 'Data',
        type: 'date',
        disabled: true,
        defaultValue: FormatUtils.formatDateForInput(agendamentoAulaAtual?.data),
        validators: { required: true, errorMessages: { required: 'A data é obrigatória.' } },
      },
      {
        name: 'janelaHorarioId',
        label: 'Horario',
        type: 'text',
        disabled: true,
        defaultValue: `${FormatUtils.formatHour(agendamentoAulaAtual.horaInicio)} - ${FormatUtils.formatHour(agendamentoAulaAtual.horaFim)}`,
        validators: { required: true, errorMessages: { required: 'O horário é obrigatório.' } },
      },
      {
        name: 'cursoId',
        label: 'Curso',
        type: 'select',
        options: cursoOptions,
        disabled: true,
        defaultValue: this.cursoIdAtual,
        validators: { required: true, errorMessages: { required: 'O curso é obrigatório.' } },
      },
      {
        name: 'disciplinaId',
        label: 'Disciplina',
        type: 'select',
        defaultValue: agendamentoAulaAtual.disciplinaId,
        options: disciplinaOptions,
        disabled: true,
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
        defaultValue: agendamentoAulaAtual.salaId,
        validators: {
          required: true,
          errorMessages: { required: 'A seleção da sala é obrigatória.' },
        },
      },
    ];
  }

  onFormSubmit(formData: Record<string, string>): void {
    if (!this.agendamentoAtual || !this.currentUser) {
      console.error('Dados do agendamento original não encontrados. Não é possível atualizar.');
      return;
    }

    const agendamentoAtualizado: AgendamentoAulaEditarRequest = {
      data: formData['data'],
      disciplinaId: Number(formData['disciplinaId']),
      isEvento: false,
      janelasHorarioId: Number(formData['janelaHorarioId']),
      quantidade: Number(formData['qtdAulas']),
      salaId: Number(formData['localId']),
      usuarioId: this.currentUser.usuarioId,
    };
    this.agendamentoService
      .editAgendamentoAula(this.agendamentoAtual.agendamentoAulaId, agendamentoAtualizado)
      .subscribe({
        next: () => {
          this.router.navigate(['/aulas']);
          this.notificationService.showSuccess('Agendamento alterado com sucesso');
        },
        error: (err) => {
          this.notificationService.showError('Erro ao alterar agendamento');
          console.error(err);
        },
      });
  }

  onScheduleSubmitAttempt(formData: Record<string, string>): void {
    this.pendingFormData = formData;
    this.confirmModal.open();
  }

  onConfirmSubmit(): void {
    if (this.pendingFormData) {
      this.onFormSubmit(this.pendingFormData);
      this.pendingFormData = null;
    } else {
      console.error('Confirmação de submit sem dados pendentes.');
    }
  }

  confirmCancel(): void {
    this.pendingFormData = null;
  }
}
