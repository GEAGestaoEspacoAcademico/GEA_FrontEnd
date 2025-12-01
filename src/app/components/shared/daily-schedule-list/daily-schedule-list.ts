import { Component, EventEmitter, Input, type OnChanges, Output, type SimpleChanges } from '@angular/core';
import type { Agendamento } from '../../../models/agendamento.model';

@Component({
  selector: 'app-daily-schedule-list',
  standalone: false,
  templateUrl: './daily-schedule-list.html',
  styleUrl: './daily-schedule-list.css'
})
export class DailyScheduleList implements OnChanges {
  @Input() dataSelecionada: Date | string = new Date();
  @Input() agendamentos: Agendamento[] = [];

  @Output() onedit = new EventEmitter<number>();
  @Output() ondelete = new EventEmitter<number>();

  termoBusca: string = '';
  agendamentosFiltrados: Agendamento[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agendamentos']) {
      this.filtrarAgendamentos();
    }
  }

  filtrarAgendamentos(): void {
    if (!this.termoBusca) {
      this.agendamentosFiltrados = [...this.agendamentos];
    } else {
      const termo = this.termoBusca.toLowerCase();
      this.agendamentosFiltrados = this.agendamentos.filter(a =>
        a.sala.salaNome.toLowerCase().includes(termo)
      );
    }

    this.agendamentosFiltrados.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  }

  editar(id: number): void {
    this.onedit.emit(id);
  }

  excluir(id: number): void {
    this.ondelete.emit(id);
  }
}
