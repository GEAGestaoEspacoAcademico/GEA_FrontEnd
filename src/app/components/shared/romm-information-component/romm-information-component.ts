import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-romm-information-component',
  standalone: false,
  templateUrl: './romm-information-component.html',
  styleUrl: './romm-information-component.css'
})
export class RommInformationComponent {
    @Input() labData!: LabInfo;
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onConfirmSchedule = new EventEmitter<LabInfo>();

    showModal = false;

    openModal(){
      this.showModal = true;
    }

    closeModal(){
      this.showModal = false;
    }

    confirmSchedule(){
      this.onConfirmSchedule.emit(this.labData);
      this.closeModal();
    }
}

export interface LabInfo {
  nome: string;
  data: string;
  horario: string;
  capacidade: string;
  observacoes: string[];
}
