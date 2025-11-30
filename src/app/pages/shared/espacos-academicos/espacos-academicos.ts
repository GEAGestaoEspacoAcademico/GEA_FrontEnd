import { Component } from '@angular/core';
 
@Component({
  selector: 'app-espacos-academicos',
  standalone: false,
  templateUrl: './espacos-academicos.html',
  styleUrl: './espacos-academicos.css',
})
export class EspacosAcademicos {
 
  textoPesquisa: string = '';
  modoVisualizacao: 'Hoje' | 'Semana' = 'Hoje';
  dataSelecionada: Date = new Date();
 
  setModo(modo: 'Hoje' | 'Semana') {
    this.modoVisualizacao = modo;
  }
}
