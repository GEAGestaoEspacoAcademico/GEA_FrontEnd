import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormatUtils } from '../../../utils/format.utils';
import type { AgendamentoAula } from '../../../models/agendamentoAula.model';

@Component({
  selector: 'app-class-info-card',
  standalone: false,
  templateUrl: './class-info-card.html',
  styleUrl: './class-info-card.css',
})
export class ClassInfoCard {
  @Input({ required: true }) agendamentoData!: AgendamentoAula;
  @Output() delete = new EventEmitter<number>();
  @Output() alterar = new EventEmitter<number>();

  public currentDate = FormatUtils.toId(new Date());

  public handleDelete(): void {
    this.delete.emit(this.agendamentoData.agendamentoAulaId);
  }

  public handleAlterar(): void {
    this.alterar.emit(this.agendamentoData.agendamentoAulaId);
  }
}
