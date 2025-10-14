import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Agendamento } from '../../../models/agendamento.model';


@Component({
  selector: 'app-class-info-card',
  standalone: false,
  templateUrl: './class-info-card.html',
  styleUrl: './class-info-card.css'
})
export class ClassInfoCard {
  @Input ({required: true}) classData!: Agendamento;

  @Output() delete = new EventEmitter<number>();
  @Output() view   = new EventEmitter<number>();

  handleDelete(): void { this.delete.emit(this.classData.id); }
  handleView(): void   { this.view.emit(this.classData.id); }
}