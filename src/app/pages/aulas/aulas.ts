import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import type { Agendamento } from '../../models/agendamento.model';
import type { Day } from '../../components/shared/day-selector/day-selector';
import { Router } from '@angular/router';
import { map, type Observable } from 'rxjs';
import { selectTodasAsAulas, selectAgendamentoLoading } from '../../store/agendamento/agendamento.selectors';
import { Store } from '@ngrx/store';
import { AgendamentoActions } from '../../store/agendamento/agendamento.actions';
import type { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-aulas',
  standalone: false,
  templateUrl: './aulas.html',
  styleUrl: './aulas.css'
})
export class Aulas implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  private currentDate = new Date();
  
  days: Day[] = [];
  activeDayId!: string;
  monthToDisplay!: string;

  agendamentos$: Observable<Agendamento[]> = this.store.select(selectTodasAsAulas);
  loading$: Observable<boolean> = this.store.select(selectAgendamentoLoading);
  agendamentosDoDiaSelecionado$!: Observable<Agendamento[]>;

  @ViewChild('confirmModal') confirmModal!: ConfirmationModal;
  agendamentoToCancelId: number | null = null;


  ngOnInit(): void {
    this.store.dispatch(AgendamentoActions.loadAgendamentos());
    this.activeDayId = this.toId(new Date());
    this.generateDaysForMonth();
    this.updateAgendamentosForActivyDay();
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

    if (this.confirmModal && typeof this.confirmModal.open === 'function') {
      this.confirmModal.open();
      return;
    }

    setTimeout(() => {
      if (this.confirmModal && typeof this.confirmModal.open === 'function') {
        this.confirmModal.open();
      } else {
        console.warn('ConfirmationModal não inicializado. Cancelamento não confirmado.');
      }
    }, 50);
  }

  confirmCancel(): void {
    if (this.agendamentoToCancelId === null) { return; }

    const id = this.agendamentoToCancelId;
    this.store.dispatch(AgendamentoActions.deleteAgendamento({ id }));

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
      map(agendamentos => {
        const diaAtivoDate = new Date(`${this.activeDayId}T12:00:00Z`);
        const diaDaSemanaAtivo = diaAtivoDate.toLocaleDateString('pt-BR', { weekday: 'long' });

        const agendamentosFiltrados = agendamentos.filter(agendamento => {
          const inicio = new Date(agendamento.dataInicio);
          inicio.setUTCHours(0, 0, 0, 0);
          
          const fim = new Date(agendamento.dataFinal);
          fim.setUTCHours(23, 59, 59, 999);

          const isDentroDoIntervalo = diaAtivoDate >= inicio && diaAtivoDate <= fim;
          const isMesmoDiaDaSemana = agendamento.diaDaSemana.toLowerCase() === diaDaSemanaAtivo.toLowerCase();

          return isDentroDoIntervalo && isMesmoDiaDaSemana;
        });
        
        return agendamentosFiltrados.sort((a, b) => a.horario.localeCompare(b.horario));
      })
    );
  }

  private generateDaysForMonth(): void {
    const result: Day[] = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.monthToDisplay = this.currentDate.toLocaleDateString('pt-BR', { month: 'short' }); 

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const fmtDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit' });
    const fmtWeek = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      result.push({
        id: this.toId(d),
        date: fmtDate.format(d),
        dayOfWeek: fmtWeek.format(d).toLowerCase().replace('.', '')
      });
    }
    this.days = result;
  }

  private toId(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}