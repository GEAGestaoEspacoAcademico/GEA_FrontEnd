import { Component } from '@angular/core';
import type { Day } from './components/shared/day-selector/day-selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
})
export class App {
    availableDays: Day[] = [
    { id: '2025-10-01', date: '01', dayOfWeek: 'qua' },
    { id: '2025-10-02', date: '02', dayOfWeek: 'qui' },
    { id: '2025-10-03', date: '03', dayOfWeek: 'sex' },
    { id: '2025-10-04', date: '04', dayOfWeek: 'sab' },
    { id: '2025-10-05', date: '05', dayOfWeek: 'dom' },
  ];

  selectedDayId: string | number = '2025-10-03';

  selectDay(id: string | number) {
    this.selectedDayId = id;
  }
}
