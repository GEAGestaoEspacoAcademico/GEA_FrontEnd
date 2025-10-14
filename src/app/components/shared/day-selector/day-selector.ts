import { Component, ElementRef, EventEmitter, inject, Input, Output } from '@angular/core';

@Component({
  selector: 'app-day-selector',
  standalone: false,
  templateUrl: './day-selector.html',
  styleUrl: './day-selector.css'
})
export class DaySelector {
  private el = inject(ElementRef)
  @Input() days!: Day[];
  @Input() activeDayId!: string | number;
  @Output() dayChange = new EventEmitter<string | number>();

  showLeftFade = false;
  showRightFade = true;

  selectDay(id: string | number): void {
    if(id !== this.activeDayId){
      this.dayChange.emit(id);
    }
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
    
    // Tolerância para evitar problemas com valores decimais
    const tolerance = 1;

    // Mostra o fade esquerdo se a rolagem não estiver no início
    this.showLeftFade = scrollLeft > tolerance;

    // Mostra o fade direito se a rolagem não estiver no final
    this.showRightFade = scrollLeft + clientWidth < scrollWidth - tolerance;
  }
}

export interface Day {
  id: string | number;
  date: string;
  dayOfWeek: string;
}
