import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import type { Day } from '../../../components/shared/day-selector/day-selector';
import { Router } from '@angular/router';
import { map, take, type Observable } from 'rxjs';
import {
  selectTodasOsAgendamentos,
  selectAgendamentoLoading,
} from '../../../store/agendamento/agendamento.selectors';
import { Store } from '@ngrx/store';
import { AgendamentoActions } from '../../../store/agendamento/agendamento.actions';
import type { ConfirmationModal } from '../../../components/modals/confirmation-modal/confirmation-modal';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { FormatUtils } from '../../../utils/format.utils';
import type { AgendamentoAula } from '../../../models/agendamentoAula.model';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import { selectUserCargo } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-aulas',
  standalone: false,
  templateUrl: './aulas.html',
  styleUrl: './aulas.css',
})
export class Aulas implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private notificationService = inject(SnackBarService);
  private headerService = inject(HeaderTitleService);

  private currentDate = new Date();

  days: Day[] = [];
  activeDayId!: string;
  monthToDisplay!: string;

  agendamentos$: Observable<AgendamentoAula[]> = this.store.select(selectTodasOsAgendamentos);
  loading$: Observable<boolean> = this.store.select(selectAgendamentoLoading);

  agendamentosDoDiaSelecionado$!: Observable<AgendamentoAula[]>;
  cargo$: Observable<string | undefined> = this.store.select(selectUserCargo)

  @ViewChild('confirmCancelModel') confirmModal!: ConfirmationModal;
  agendamentoToCancelId: number | null = null;

  ngOnInit(): void {
    this.headerService.setTitle('Aulas');
    this.headerService.hideBack();
    this.store.dispatch(AgendamentoActions.loadAgendamentos());
    this.activeDayId = FormatUtils.toId(new Date());
    this.generateDaysForMonth();
    this.updateAgendamentosForActivyDay();
    this.cargo$
      .pipe(take(1))
      .subscribe((cargo) => {
        if (cargo === 'COORDENADOR') {
          this.headerService.setTitle("")
          this.headerService.showBack()
        } else {
          this.headerService.hideBack();
        }
      });
  }

  onMonthNavigate(direction: 'previous' | 'next'): void {
    // Adiciona ou subtrai um mês da data atual
    const newMonth = this.currentDate.getMonth() + (direction === 'next' ? 1 : -1);
    this.currentDate.setMonth(newMonth);
    this.generateDaysForMonth();
    this.activeDayId = this.days[0].id;
    this.updateAgendamentosForActivyDay();
  }

  onDayChange(id: string | number): void {
    this.activeDayId = String(id);
    this.updateAgendamentosForActivyDay();
  }

  requestCancelConfirmation(id: number): void {
    this.agendamentoToCancelId = id;
    this.confirmModal.open();
  }

  confirmCancel(): void {
    if (this.agendamentoToCancelId === null) {
      return;
    }
    this.store.dispatch(AgendamentoActions.deleteAgendamento({ id: this.agendamentoToCancelId }));
    this.agendamentoToCancelId = null;
    this.notificationService.showSuccess('Aula cancelada com sucesso');
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
  private updateAgendamentosForActivyDay(): void {
    this.agendamentosDoDiaSelecionado$ = this.agendamentos$.pipe(
      map((agendamentos) => {
        const agendamentosFiltrados = agendamentos.filter((agendamento) => {
          const isDentroDoIntervalo = this.activeDayId === agendamento.data;
          return isDentroDoIntervalo;
        });
        return agendamentosFiltrados.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
      }),
    );
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
