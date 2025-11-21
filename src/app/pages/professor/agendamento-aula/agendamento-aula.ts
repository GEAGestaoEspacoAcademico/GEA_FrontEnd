import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { DisciplinaService } from '../../../services/disciplina/disciplina.service';
import type { Disciplina } from '../../../models/disciplina.model';

@Component({
  selector: 'app-agendamento-aula',
  standalone: false,
  templateUrl: './agendamento-aula.html',
  styleUrl: './agendamento-aula.css',
})
export class AgendamentoAula implements OnInit {
  private disciplinaService = inject(DisciplinaService);

  disciplinas: Disciplina[] = [];

  ngOnInit(): void {
    this.disciplinaService.getDisciplinas().subscribe({
      next: (data) => (this.disciplinas = data),
      error: (err) => console.error(err),
    });
  }
}
