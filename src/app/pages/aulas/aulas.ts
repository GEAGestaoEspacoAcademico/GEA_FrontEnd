import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import type { Agendamento } from '../../models/agendamento.model';
import type { Day } from '../../components/shared/day-selector/day-selector';
import { Router } from '@angular/router';
import { map, type Observable } from 'rxjs';
import { selectTodasAsAulas, selectAgendamentoLoading } from '../../store/agendamento/agendamento.selectors';
import { Store } from '@ngrx/store';
import { AgendamentoActions } from '../../store/agendamento/agendamento.actions';

@Component({
  selector: 'app-aulas',
  standalone: false,
  templateUrl: './aulas.html',
  styleUrl: './aulas.css'
})
export class Aulas implements OnInit{
  private classesByDay: Record<string, Agendamento[]> = {};
  private store = inject(Store);
  private router = inject(Router)

  days: Day[] = [];
  activeDayId!: string;

  agendamentos$: Observable<Agendamento[]> = this.store.select(selectTodasAsAulas);
  loading$: Observable<boolean> = this.store.select(selectAgendamentoLoading);
  agendamentosDoDiaSelecionado$!: Observable<Agendamento[]>;

  ngOnInit(): void {
    this.store.dispatch(AgendamentoActions.loadAgendamentos());
    this.days = this.buildNextDays(7);
    this.activeDayId = this.toId(new Date());
    this.updateAgendamentosForActivyDay();
  }

  onDayChange(id: string | number) {
    this.activeDayId = String(id);
    this.updateAgendamentosForActivyDay();
  }

  handleDeleteAgendamento(id: number) {
    this.store.dispatch(AgendamentoActions.deleteAgendamento({ id }));
  }

  handleViewAgendamento(id: number) {
    this.router.navigate(['/aulas/alterar', id])
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

  private buildNextDays(n: number): Day[] {
    const result: Day[] = [];
    const fmtDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit' });
    const fmtWeek = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

    const today = new Date();
    for (let i = 0; i < n; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      result.push({
        id: this.toId(d),
        date: fmtDate.format(d),
        dayOfWeek: fmtWeek.format(d).toLowerCase() 
      });
    }
    return result;
  }

  private toId(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}