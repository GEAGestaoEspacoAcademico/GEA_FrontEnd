import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import type { Class } from '../../models/class.model';
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
  private classesByDay: Record<string, Class[]> = {};
  private store = inject(Store);
  private router = inject(Router)
  days: Day[] = [];
  activeDayId!: string;

  classes$: Observable<Class[]> = this.store.select(selectTodasAsAulas);
  loading$: Observable<boolean> = this.store.select(selectAgendamentoLoading);

    classesForSelectedDay$!: Observable<Class[]>;



  classesForSelectedDay: Class[] = [];

  ngOnInit(): void {
    this.store.dispatch(AgendamentoActions.loadAulas());
    this.days = this.buildNextDays(7);
    this.activeDayId = this.toId(new Date());


    console.log('ID do dia ativo:', this.activeDayId);


    this.updateClassesForActiveDay();
  }

  onDayChange(id: string | number) {
    this.activeDayId = String(id);
    this.updateClassesForActiveDay();
  }

  handleDeleteClass(id: number) {
    this.store.dispatch(AgendamentoActions.deleteAula({ id }));
  }

  handleViewClass(id: number) {
    this.router.navigate(['/aulas/alterar', id])
  }

  private updateClassesForActiveDay(): void {
    this.classesForSelectedDay$ = this.classes$.pipe(
      map(aulas => {
          const aulasFiltradas = aulas.filter(aula => this.toId(aula.dataInicio) ===   this.activeDayId);            
          return aulasFiltradas.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
        }
      )
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