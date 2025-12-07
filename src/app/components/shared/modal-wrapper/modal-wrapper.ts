import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-wrapper',
  standalone: false,
  templateUrl: './modal-wrapper.html',
  styleUrl: './modal-wrapper.css',
})
export class ModalWrapper {
  @Input() title!: string;
  @Output() closeModal = new EventEmitter<void>();
}
