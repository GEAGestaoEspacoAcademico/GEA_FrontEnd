import { Component, Input} from '@angular/core';
import type { OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  standalone: false,
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.css'
})
export class DashboardCard implements OnInit {
  @Input() iconName: string = 'home';
  @Input() iconNameCalendar: string = 'calendar';
  @Input() iconNameComputer: string = 'computer';
  @Input() iconNameTada: string = 'tada';

  @Input() title: string = 'Visualizar Espaço';
  @Input() titleCalendar: string = 'Agendar Aulas';
  @Input() titleComputer: string = 'Cadastrar Laboratorio';
  @Input() titleTada: string = 'Agendar Evento';

  @Input() routerLink!: any[];
  ngOnInit(): void {
    if (!this.iconName || !this.title || !this.iconNameCalendar) {
        console.warn('DashboardCardComponent: iconName e title devem ser fornecidos.');
    }
  }
}
