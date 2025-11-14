import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendamentoService } from '../../../services/agendamentos/agendamento.service';

@Component({
  selector: 'app-schedule-day-modal-component',
  standalone: false,
  templateUrl: './schedule-day-modal-component.html',
  styleUrl: './schedule-day-modal-component.css',
})
export class ScheduleDayModalComponent {
  @Input() selectedDate!: Date;
  @Output() closeModal = new EventEmitter<void>();
  @Output() editAgendamento = new EventEmitter<number>();
  @Output() deleteAgendamento = new EventEmitter<number>();

  private modalService = inject(NgbModal);
  private agendamentoService = inject(AgendamentoService);
}
