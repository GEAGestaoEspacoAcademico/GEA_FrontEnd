import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';

@Component({
  selector: 'app-notificacoes',
  standalone: false,
  templateUrl: './notificacoes.html',
  styleUrl: './notificacoes.css',
})
export class Notificacoes implements OnInit {
  private headerService = inject(HeaderTitleService);

  ngOnInit(): void {
    this.headerService.setTitle('Notificações');
    this.headerService.hideBack();
  }

  notificacoes: Notificacao[] = [
    {
      source: 'Fatec | Comunicação Geral',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      date: new Date('2024-06-15T10:30:00'),
      snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing ',
    },
    {
      source: 'Lembrete de Reunião',
      title: 'Você tem uma reunião agendada para amanhã às 14h com a equipe de backend.',
      date: new Date('2024-06-14T09:00:00'),
      snippet: 'Lorem lorem',
    },
  ];
}

interface Notificacao {
  source: string;
  title: string;
  date: Date;
  snippet: string;
}
