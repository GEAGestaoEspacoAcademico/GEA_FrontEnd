import { Component, EventEmitter, Input, Output } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModal } from '../confirmation-modal/confirmation-modal';

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

  @Input() mode!: string;
  @Input() title!: string;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private modalService: NgbModal) { }

  showModal = false;

  openModal() {
    const modalRef = this.modalService.open(ConfirmationModal, {
      centered: true,
      backdrop: 'static',
      size: 'md'
    });

    modalRef.componentInstance.mode = this.mode;
    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.detailsData = this.labData;

    modalRef.componentInstance.onConfirm.subscribe(() => {
      modalRef.close();
    });
  }
}

export interface LabInfo {
  nome: string;
  data: string;
  horario: string;
  capacidade: string;
  observacoes: string[];
}
