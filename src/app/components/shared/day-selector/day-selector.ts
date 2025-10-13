import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-day-selector',
  standalone: false,
  templateUrl: './day-selector.html',
  styleUrl: './day-selector.css'
})
export class DaySelector {
  @Input() days!: Day[];
  @Input() activeDayId!: string | number;
  @Output() dayChange = new EventEmitter<string | number>();

  selectDay(id: string | number): void {
    if(id !== this.activeDayId){
      this.dayChange.emit(id);
    }
  }
}

export interface Day {
  id: string | number;
  date: string;
  dayOfWeek: string;
}
