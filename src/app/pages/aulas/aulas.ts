import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import type { Class } from '../../models/class.model';
import type { Day } from '../../components/shared/day-selector/day-selector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aulas',
  standalone: false,
  templateUrl: './aulas.html',
  styleUrl: './aulas.css'
})
export class Aulas implements OnInit{
  private classesByDay: Record<string, Class[]> = {};
  private router = inject(Router)
  days: Day[] = [];
  activeDayId!: string;


  classesForSelectedDay: Class[] = [];

  ngOnInit(): void {
    this.days = this.buildNextDays(7);

    this.activeDayId = this.toId(new Date());

    this.seedClasses();

    this.updateClassesForActiveDay();
  }

  onDayChange(id: string | number) {
    this.activeDayId = String(id);
    this.updateClassesForActiveDay();
  }

  handleDeleteClass(id: number) {
    this.classesByDay[this.activeDayId] =
      (this.classesByDay[this.activeDayId] ?? []).filter(c => c.id !== id);
    this.updateClassesForActiveDay();
  }

  handleViewClass(id: number) {
    this.router.navigate(['/aulas/alterar', id])
  }

  private updateClassesForActiveDay(): void {
    const list = this.classesByDay[this.activeDayId] ?? [];
    this.classesForSelectedDay = [...list].sort((a, b) =>
      a.time.localeCompare(b.time)
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

  private seedClasses(): void {
   const mockClassesByDay = [
    [
      { id: 101, courseName: 'Mecatrônica',time: '07:40–09:20', location: 'Sala 04', semester: '2º Semestre', subject: 'Cálculo I' },
      { id: 106, courseName: 'Mecatrônica',time: '09:30–11:10', location: 'Sala 04', semester: '2º Semestre', subject: 'Álgebra Linear' },
    ],
    [
      { id: 102, courseName: 'Engenharia de Controle', time: '09:30–11:10', location: 'Sala 02', semester: '2º Semestre', subject: 'Física II' },
      { id: 202, courseName: 'Engenharia de Controle', time: '13:30–15:10', location: 'Lab 01',  semester: '2º Semestre', subject: 'Sinais e Sistemas' },
      { id: 203, courseName: 'Engenharia de Controle', time: '15:20–17:00', location: 'Sala 05', semester: '2º Semestre', subject: 'Controle I' },
    ],
    [
      { id: 103, courseName: 'Automação Industrial',time: '13:30–15:10', location: 'Lab 01',  semester: '2º Semestre', subject: 'Eletrônica Digital' },
    ],
    [
      { id: 104, courseName: 'Computação Aplicada',time: '15:20–17:00', location: 'Sala 10', semester: '2º Semestre', subject: 'Estruturas de Dados' },
    ],
    [
      { id: 105, courseName: 'Materiais e Processos',time: '19:00–20:40', location: 'Sala 06', semester: '2º Semestre', subject: 'Resistência dos Materiais' },
    ]
  ];

  mockClassesByDay.forEach((classes, index) => {
    const dayId = this.days[index]?.id;
    
    if (dayId && classes.length > 0) {
      this.classesByDay[dayId] = classes;
    }
  });
  }

}