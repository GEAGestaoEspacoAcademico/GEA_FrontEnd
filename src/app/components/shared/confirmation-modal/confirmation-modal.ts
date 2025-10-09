import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: false,
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css'
})
export class ConfirmationModal {

  @Input({required : true}) title!: string;
  @Input({required : true}) message!: string;
  @Input() confirmText!: string;
  @Input() cancelText!: string;

  @Output() modalConfirm = new EventEmitter<void>();
  @Output() modalCancel = new EventEmitter<void>();


}
