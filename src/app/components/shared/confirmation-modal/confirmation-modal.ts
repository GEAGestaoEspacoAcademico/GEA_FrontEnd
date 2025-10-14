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
  @Input() confirmText!: string;
  @Input() cancelText!: string;

  @Output() modalConfirm = new EventEmitter<void>();
  @Output() modalCancel = new EventEmitter<void>();

  @ViewChild('ConfirmationModal')
  modalTemplate!: TemplateRef<ConfirmationModal>;

  open(ConfirmationModal: TemplateRef<ConfirmationModal>) {
    this.modalService.open(ConfirmationModal, { backdrop: 'static', centered: true, size: 'sm' });
  }

  onModalConfirm(): void {
    this.modalConfirm.emit();
    this.modalService.dismissAll();
  }

  onModalCancel(): void {
    this.modalCancel.emit();
    this.modalService.dismissAll();
  }
}
