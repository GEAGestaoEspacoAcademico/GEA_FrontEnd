import { Component } from '@angular/core';
import type { Class } from './models/class.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
})
export class App {
  testClass: Class = {
    id: 1,
    courseName: 'Mecatrônica',
    time: '7:40–9:20',
    location: 'Sala 04',
    semester: '2º Semestre',
    subject: 'Cálculo I'
  };

  handleDeleteClass(id: number) {
    console.log('Excluir id:', id);
  }

  handleViewClass(id: number) {
    console.log('Visualizar id:', id);
  }
}
