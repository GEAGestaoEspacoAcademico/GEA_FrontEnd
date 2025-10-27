import type { OnInit} from '@angular/core';
import { Component, ElementRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormatUtils } from '../../../utils/format.utils';

@Component({
  selector: 'app-day-selector',
  standalone: false,
  templateUrl: './day-selector.html',
  styleUrl: './day-selector.css'
})
export class DaySelector{
  private el = inject(ElementRef)
  @Input() currentMonthName!: string;
  @Input() days!: Day[];
  @Input() activeDayId!: string | number;
  @Output() monthChange = new EventEmitter<'previous' | 'next'>();
  @Output() dayChange = new EventEmitter<string | number>();

  showLeftFade = false;
  showRightFade = true;
  currentDay: string = FormatUtils.toId(new Date());
  

  selectDay(id: string | number): void {
    if(id !== this.activeDayId){
      this.dayChange.emit(id);
    }
  }
  
  navigateMonth(direction: 'previous' | 'next'): void {
    this.monthChange.emit(direction);
  }

  onScroll(event: Event): void {
    this.checkScroll(event.target as HTMLElement);
  }
    private checkScroll(element?: HTMLElement): void {
    const el = element || this.el.nativeElement.querySelector('.day-selector');

    if (!el) {return;}

    const scrollLeft = el.scrollLeft;
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;
    const tolerance = 1;
    this.showLeftFade = scrollLeft > tolerance;
    this.showRightFade = scrollLeft + clientWidth < scrollWidth - tolerance;
  }
}

export interface Day {
  id: string;
  date: string;
  dayOfWeek: string;
}
