import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import type { Day } from '../../../components/shared/day-selector/day-selector';
import { Router } from '@angular/router';
import { BehaviorSubject, filter, switchMap, take, type Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import type { ConfirmationModal } from '../../../components/modals/confirmation-modal/confirmation-modal';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { FormatUtils } from '../../../utils/format.utils';
import type { AgendamentoAula } from '../../../models/agendamentoAula.model';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import { selectUserCargo, selectUserId } from '../../../store/auth/auth.selectors';
import { AgendamentoService } from '../../../services/agendamento/agendamento.service';

@Component({
  selector: 'app-aulas',
  standalone: false,
  templateUrl: './aulas.html',
  styleUrl: './aulas.css',
})
export class Aulas implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private agendamentoService = inject(AgendamentoService);
  private headerService = inject(HeaderTitleService);
  private snackBarService = inject(SnackBarService);

  private currentDate = new Date();

  days: Day[] = [];
  activeDayId!: string;
  monthToDisplay!: string;

  aulasCorrentes: AgendamentoAula[] = [];
  agendamentosDoDiaSelecionado$ = new BehaviorSubject<AgendamentoAula[]>([]);
  isLoading = false;

  cargo$: Observable<string | undefined> = this.store.select(selectUserCargo);
  cargoUsuario: string = '';
  usuarioId$: Observable<number | undefined> = this.store.select(selectUserId);

  @ViewChild('confirmCancelModel') confirmModal!: ConfirmationModal;
  agendamentoToCancelId: number | null = null;

  ngOnInit(): void {
    this.headerService.setTitle('Aulas');
    this.headerService.hideBack();

    this.activeDayId = FormatUtils.toId(new Date());
    this.generateDaysForMonth();
    this.cargo$.pipe(take(1)).subscribe((cargo) => {
      if (!cargo) {
        return;
      }
      this.cargoUsuario = cargo;
      if (cargo === 'COORDENADOR') {
        this.headerService.setTitle('');
        this.headerService.showBack();
        this.carregarAulasCoordenador();
      } else {
        this.headerService.hideBack();
        this.carregarAulasProfessor();
      }
    });
  }

  carregarAulasProfessor() {
    this.usuarioId$
      .pipe(
        filter((id) => !!id),
        take(1),
        switchMap((usuarioId) => {
          return this.agendamentoService.getAgendamentosPorfessor(usuarioId!);
        }),
      )
      .subscribe({
        next: (agendamento) => (this.aulasCorrentes = agendamento),
        error: (_) => this.snackBarService.showError('Erro ao carregar agendamentos'),
      });
  }

  carregarAulasCoordenador() {
    this.agendamentoService.getAgendamentoAula().subscribe({
      next: (agendamentos) => (this.aulasCorrentes = agendamentos),
      error: (_) =>
        this.snackBarService.showError('Erro ao carregar agendamentos para Coordenador'),
    });
  }

  onMonthNavigate(direction: 'previous' | 'next'): void {
    const newMonth = this.currentDate.getMonth() + (direction === 'next' ? 1 : -1);
    this.currentDate.setMonth(newMonth);
    this.generateDaysForMonth();
    this.activeDayId = this.days[0].id;

    this.filtrarAulasDiaAtual();
  }

  onDayChange(id: string | number): void {
    this.activeDayId = String(id);
    this.filtrarAulasDiaAtual();
  }

  requestCancelConfirmation(id: number): void {
    this.agendamentoToCancelId = id;
    this.confirmModal.open();
  }

  private filtrarAulasDiaAtual() {
    const aulasdoDia = this.aulasCorrentes.filter((aula) => {
      return aula.data === this.activeDayId;
    });

    aulasdoDia.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    this.agendamentosDoDiaSelecionado$.next(aulasdoDia);
  }

  confirmCancel(): void {
    if (this.agendamentoToCancelId === null) {
      return;
    }
    this.isLoading = true;
    this.agendamentoService.deleteAgendamentoAula(this.agendamentoToCancelId).subscribe({
      next: () => {
        this.snackBarService.showSuccess('Agendamento cancelado com sucesso');
        this.aulasCorrentes = this.aulasCorrentes.filter(
          (a) => a.agendamentoAulaId !== this.agendamentoToCancelId,
        );
        this.filtrarAulasDiaAtual();

        this.agendamentoToCancelId = null;
        this.isLoading = false;
      },
      error: (_) => {
        this.snackBarService.showError('Erro ao cancelar o agendamento');
        this.isLoading = false;
      },
    });
  }

  closeModal() {
    this.agendamentoToCancelId = null;
  }

  closeCancelModal(): void {
    this.agendamentoToCancelId = null;
  }

  handleViewAgendamento(id: number): void {
    this.router.navigate(['/aulas/alterar', id]);
  }

  private generateDaysForMonth(): void {
    const result: Day[] = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.monthToDisplay = this.currentDate.toLocaleDateString('pt-BR', { month: 'short' });

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      result.push({
        id: FormatUtils.toId(d),
        date: FormatUtils.formatDayLabel(d),
        dayOfWeek: FormatUtils.formatWeekdayLabel(d),
      });
    }
    this.days = result;
  }
}
