import { Component } from '@angular/core';

@Component({
  selector: 'app-configuracoes',
  standalone: false,
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css',
})
export class Configuracoes {
  logout() {
    console.warn('Professor deslogado');
  }
}
