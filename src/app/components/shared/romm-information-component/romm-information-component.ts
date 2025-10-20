import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import type { RoomData } from '../../../models/room.model';

@Component({
  selector: 'app-romm-information-component',
  standalone: false,
  templateUrl: './romm-information-component.html',
  styleUrl: './romm-information-component.css'
})
export class RommInformationComponent {
  private modalService = inject(NgbModal)
  @Input() labData!: RoomData;
  @Output() ConfirmSchedule = new EventEmitter<void>();

  execute(){
    this.ConfirmSchedule.emit();
  }
}
