import { Component, EventEmitter, Input, Output } from '@angular/core';
 
import type { RoomData } from '../../../models/room.model';

@Component({
  selector: 'app-romm-information-component',
  standalone: false,
  templateUrl: './romm-information-component.html',
  styleUrl: './romm-information-component.css'
})
export class RommInformationComponent {
  @Input() labData!: RoomData;
  @Output() ConfirmSchedule = new EventEmitter<number>();

  execute(){
    this.ConfirmSchedule.emit(this.labData.id);
  }
}
