import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';

@Component({
  selector: 'app-espacos-academicos',
  standalone: false,
  templateUrl: './espacos-academicos.html',
  styleUrl: './espacos-academicos.css',
})
export class EspacosAcademicos implements OnInit {
  private titleService = inject(HeaderTitleService);

  ngOnInit(): void {
    this.titleService.showBack();
    this.titleService.setTitle('');
  }

  textoPesquisa: string = '';
  modoVisualizacao: 'Hoje' | 'Semana' = 'Hoje';
  dataSelecionada: Date = new Date();

  setModo(modo: 'Hoje' | 'Semana') {
    this.modoVisualizacao = modo;
  }
}
