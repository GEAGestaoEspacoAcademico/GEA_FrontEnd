import { Component, output } from '@angular/core';

@Component({
  selector: 'app-agendar-sala-materia',
  standalone: false,
  templateUrl: './agendar-sala-materia.html',
  styleUrl: './agendar-sala-materia.css'
})
export class AgendarSalaMateria {
  recurringDaysSelect = output<Date[]>();

  // Gerando datas futuras dinamicamente para o mock
  mockDates: Date[] = Array.from({length: 6}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i * 7) + 1); // Próximos dias com intervalo de uma semana
    return d;
  });

  selectedDates: Date[] = [];

  private dateToISOString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  isSelected(date: Date): boolean {
    const dateStr = this.dateToISOString(date);
    return this.selectedDates.some(d => this.dateToISOString(d) === dateStr);
  }

  toggleDate(date: Date): void {
    const dateStr = this.dateToISOString(date);
    const index = this.selectedDates.findIndex(d => this.dateToISOString(d) === dateStr);
    
    if (index > -1) {
      this.selectedDates.splice(index, 1);
    } else {
      this.selectedDates.push(date);
    }
    
    // Ordena cronologicamente
    this.selectedDates.sort((a, b) => a.getTime() - b.getTime());
    this.recurringDaysSelect.emit([...this.selectedDates]); // Emite uma cópia
  }
}
