import type { TemplateRef } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendamentoService } from '../../../services/agendamentos/agendamento.service';
import type { AgendamentoData, SlotHorario } from '../../../models/agendamento.model';

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
  loading = false;

  @ViewChild('ScheduleDayModal')
  modalTemplate!: TemplateRef<ScheduleDayModal>;

  private modalService = inject(NgbModal);
  private agendamentoService = inject(AgendamentoService);

  buscarAgendamentos(): void {
    this.loading = true;
    const d = new Date(this.selectedDate);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dataFormatada = `${year}-${month}-${day}`;

    this.agendamentoService.getAgendamentoPorDia(dataFormatada).subscribe({
      next: (dados: AgendamentoData[]) => {
        this.agendamento = dados || [];
        this.mapearAgendamentos();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar agendamentos:', err);
        this.agendamento = [];
        this.loading = false;
      },
    });
  }

  mapearAgendamentos(): void {
    this.horarios.forEach((slot) => {
      const agendamentoEncontrado = this.agendamento.find((agendamento) => {
        const horaInicio = agendamento.horaInicio;
        const horaFim = agendamento.horaFim;
        const horarioAPI = `${horaInicio} - ${horaFim}`;
        return horarioAPI === slot.horarioComparacao;
      });
      if (agendamentoEncontrado) {
        slot.agendamento = agendamentoEncontrado;
      } else {
        slot.agendamento = undefined;
      }
    });
  }

  public abrirModal() {
    this.buscarAgendamentos();
    this.modalService.open(this.modalTemplate, {
      backdrop: 'static',
      centered: true,
      windowClass: 'custom-modal',
    });
  }

  modalClose() {
    this.modalService.dismissAll();
    this.closeModal.emit();
  }

  AgendamentoEdit(id: number): void {
    this.editAgendamento.emit(id);
    console.warn('Agendamento:', id);
  }

  AgendamentoDelete(id: number): void {
    this.deleteAgendamento.emit(id);
    console.warn('Agendamento:', id);
  }

  agendamento: AgendamentoData[] = [];

  horarios: SlotHorario[] = [
    { horarioExibicao: '07:40 - 08:30', horarioComparacao: '07:40:00 - 08:30:00' },
    { horarioExibicao: '09:10 - 09:20', horarioComparacao: '09:10:00 - 09:20:00' },
    { horarioExibicao: '09:30 - 10:20', horarioComparacao: '09:30:00 - 10:20:00' },
    { horarioExibicao: '10:20 - 11:10', horarioComparacao: '10:20:00 - 11:10:00' },
    { horarioExibicao: '11:20 - 12:10', horarioComparacao: '11:20:00 - 12:10:00' },
    { horarioExibicao: '12:10 - 13:00', horarioComparacao: '12:10:00 - 13:00:00' },
    { horarioExibicao: '13:20 - 14:10', horarioComparacao: '13:20:00 - 14:10:00' },
    { horarioExibicao: '14:10 - 15:00', horarioComparacao: '14:10:00 - 15:00:00' },
    { horarioExibicao: '15:10 - 16:00', horarioComparacao: '15:10:00 - 16:00:00' },
    { horarioExibicao: '16:00 - 16:50', horarioComparacao: '16:00:00 - 16:50:00' },
    { horarioExibicao: '19:00 - 19:50', horarioComparacao: '19:00:00 - 19:50:00' },
    { horarioExibicao: '19:50 - 20:40', horarioComparacao: '19:50:00 - 20:40:00' },
    { horarioExibicao: '20:50 - 21:40', horarioComparacao: '20:50:00 - 21:40:00' },
    { horarioExibicao: '21:40 - 22:30', horarioComparacao: '21:40:00 - 22:30:00' },
    { horarioExibicao: '23:00 - 23:50', horarioComparacao: '23:00:00 - 23:50:00' },
  ];
}
