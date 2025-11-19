import { Component, Input} from '@angular/core';
import type { OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  standalone: false,
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.css'
})
export class DashboardCard implements OnInit {
  @Input() iconName: string = '';
  

  @Input() title: string = '';
 

  @Input() routerLink!: string;
  
  ngOnInit(): void {
    if (!this.iconName || !this.title) {
        console.warn('DashboardCardComponent: iconName e title devem ser fornecidos.');
    }
  }
}
