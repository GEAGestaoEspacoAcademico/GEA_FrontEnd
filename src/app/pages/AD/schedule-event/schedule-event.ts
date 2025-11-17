import { Component, ViewChild } from '@angular/core';
import type { ScheduleDayModal } from '../../../components/shared/schedule-day-modal/schedule-day-modal';

@Component({
  selector: 'app-schedule-event',
  standalone: false,
  templateUrl: './schedule-event.html',
  styleUrl: './schedule-event.css'
})
export class ScheduleEvent {

  @ViewChild("scheduleModal") scheduleModal!: ScheduleDayModal;
  

  pegarDias(dias: Date[]){
    console.log(dias)
  }

  abirModalDetalhe(data: Date){
    this.scheduleModal.abrirModal(data);
  }

}
