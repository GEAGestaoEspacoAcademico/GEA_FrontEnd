import type { TemplateRef, WritableSignal } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  standalone: false,
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css'
})
export class ConfirmationModal {
 
  private modalService = inject(NgbModal);
  closeResult: WritableSignal<string> = signal('');


  @Input({required : true}) title!: string;
  @Input({required : true}) message!: string;
  @Input() confirmText!: string;
  @Input() cancelText!: string;

  @Output() modalConfirm = new EventEmitter<void>();
  @Output() modalCancel = new EventEmitter<void>();
  
 		openVerticallyCentered(content: TemplateRef<any>) {
		this.modalService.open(content, { centered: true });
	}

}
