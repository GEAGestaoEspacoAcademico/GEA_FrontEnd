import { Component, ViewChild } from '@angular/core';
import type { ScheduleDayModal } from '../../../components/shared/schedule-day-modal/schedule-day-modal';

@Component({
  selector: 'app-schedule-event',
  standalone: false,
  templateUrl: './schedule-event.html',
  styleUrl: './schedule-event.css'
})
export class ScheduleEvent {
  datasSelecionadas: Date[] = [new Date()];

  @ViewChild("scheduleModal") scheduleModal!: ScheduleDayModal;
  

  pegarDias(dias: Date[]){
    console.log(dias)
    this.datasSelecionadas = dias
  }

  salvarAgendamentos(data: any[]){
    console.log(data)
  }

  abirModalDetalhe(data: Date){
    this.scheduleModal.abrirModal(data);
  }

}
