import { Component, ViewChild } from '@angular/core';
import type { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-agenda',
  standalone: false,
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda {
  @ViewChild('ConfirmationModal')
  confirmModal!: ConfirmationModal;
}
