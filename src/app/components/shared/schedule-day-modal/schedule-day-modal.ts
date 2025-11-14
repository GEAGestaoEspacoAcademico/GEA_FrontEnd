import type { TemplateRef } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendamentoService } from '../../../services/agendamentos/agendamento.service';

@Component({
  selector: 'app-schedule-day-modal',
  standalone: false,
  templateUrl: './schedule-day-modal.html',
  styleUrl: './schedule-day-modal.css',
})
export class ScheduleDayModal {
  @Input() selectedDate!: Date;
  @Output() closeModal = new EventEmitter<void>();
  @Output() editAgendamento = new EventEmitter<number>();
  @Output() deleteAgendamento = new EventEmitter<number>();

  private modalService = inject(NgbModal);
  private agendamentoService = inject(AgendamentoService);

  @ViewChild('modalTemplate')
  modalTemplate!: TemplateRef<ScheduleDayModal>;

  private abrirModal() {
    this.modalService.open(this.modalTemplate, {
      backdrop: 'static',
      centered: true,
      size: 'sm',
    });
  }
}
