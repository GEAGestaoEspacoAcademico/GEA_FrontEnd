import type { OnInit} from '@angular/core';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { MatCalendar, type MatCalendarCellCssClasses } from '@angular/material/datepicker';

@Component({
  selector: 'app-multi-date-selector',
  standalone: false,
  templateUrl: './multi-date-selector.html',
  styleUrl: './multi-date-selector.css'
})
export class MultiDateSelector implements OnInit{
	private cdr = inject(ChangeDetectorRef) 

	@ViewChild(MatCalendar) calendar!: MatCalendar<Date>;

	@Input() initialSelectedDates: Date[] = []
	@Output() selecaoChange = new EventEmitter<Date[]>();
	@Output() doubleClick = new EventEmitter<Date>();

	private readonly CLICK_TIMEOUT_MS = 300;
  private clickTimer: any = null;
  private lastClickedDate: Date | null = null;

	datasSelecionadas: Date[] = [];

	ngOnInit(): void {
			this.datasSelecionadas = [...this.initialSelectedDates]
	}

	getDateClass(date: Date): MatCalendarCellCssClasses {
    if (this.findDateIndex(date) > -1) {
      return 'selected';
    }
    return '';
  }

  routeClick(date: Date | null): void {
    if (!date) {
      return;
    }

    if (this.clickTimer && this.isSameDate(this.lastClickedDate, date)) {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
      this.lastClickedDate = null;
      this.handleDoubleClick(date);
    } else {
      clearTimeout(this.clickTimer); 
      this.lastClickedDate = date;
      this.clickTimer = setTimeout(() => {
        this.handleSingleClick(date);
        this.clickTimer = null;
        this.lastClickedDate = null;
      }, this.CLICK_TIMEOUT_MS);
    }
  }
  private isSameDate(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) {return false;}
    return date1.getDate() === date2.getDate() &&
					date1.getMonth() === date2.getMonth() &&
					date1.getFullYear() === date2.getFullYear();
  }

  private handleDoubleClick(date: Date): void {
      this.doubleClick.emit(date);
  }

  private handleSingleClick(date: Date): void {
    const index = this.findDateIndex(date);

    if (index === -1) {
      // Adiciona ao array
      this.datasSelecionadas.push(date);
    } else {
      // Remove do array
      this.datasSelecionadas.splice(index, 1);
    }


		this.calendar.updateTodaysDate();

    this.selecaoChange.emit([...this.datasSelecionadas]);
  }

	private findDateIndex(dateToFind: Date): number {
    return this.datasSelecionadas.findIndex(d =>
      d.getDate() === dateToFind.getDate() &&
      d.getMonth() === dateToFind.getMonth() &&
      d.getFullYear() === dateToFind.getFullYear()
    );
  }
}
