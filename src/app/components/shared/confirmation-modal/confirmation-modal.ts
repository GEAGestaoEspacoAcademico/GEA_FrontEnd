import type { TemplateRef } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import type { RoomData } from '../../../models/room.model';

@Component({
  selector: 'app-confirmation-modal',
  standalone: false,
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css',
})
export class ConfirmationModal {
  private modalService = inject(NgbModal);

  @Input({ required: true }) mode: 'aviso' | 'detalhes' = 'aviso';
  @Input({ required: true }) title!: string;
  @Input() message!: string;
  @Input() detailsData!: RoomData;
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onConfirm = new EventEmitter<RoomData>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onCancel = new EventEmitter<void>();

  @ViewChild('ConfirmationModal')
  modalTemplate!: TemplateRef<ConfirmationModal>;

  open() {
    this.modalService.open(this.modalTemplate, { backdrop: 'static', centered: true, size: 'sm' });
  }

  onModalConfirm(): void {
    this.onConfirm.emit();
    this.modalService.dismissAll();
  }

  onModalCancel(): void {
    this.onCancel.emit();
    this.modalService.dismissAll();
  }
}
