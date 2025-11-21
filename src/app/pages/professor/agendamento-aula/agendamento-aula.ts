import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { DisciplinaService } from '../../../services/disciplina/disciplina.service';
import type { Disciplina } from '../../../models/disciplina.model';
import { JanelasHorarioService } from '../../../services/janelas-horario/janelas-horario.service';

@Component({
  selector: 'app-agendamento-aula',
  standalone: false,
  templateUrl: './agendamento-aula.html',
  styleUrl: './agendamento-aula.css',
})
export class AgendamentoAula implements OnInit {
  private disciplinaService = inject(DisciplinaService);
  private horariosService = inject(JanelasHorarioService);

  disciplinas: Disciplina[] = [];

  ngOnInit(): void {
    this.disciplinaService.getDisciplinas().subscribe({
      next: (data) => (this.disciplinas = data),
      error: (err) => console.error(err),
    });
  }

  equipamentos: Equipamento[] = [];
  softwares: string[] = [];

  adicionarEquipamento(nomeValue: string, qtdValue: string): void {
    const nome = (nomeValue || '').trim();
    const qtd = parseInt(qtdValue, 10);

    if (nome && qtd > 0) {
      this.equipamentos.push({ nome: nome, qtd: qtd });
    }
  }

  removerEquipamento(equipamento: Equipamento): void {
    const index = this.equipamentos.indexOf(equipamento);

    if (index >= 0) {
      this.equipamentos.splice(index, 1);
    }
  }

  adicionarSoftware(nomeValue: string): void {
    const nome = (nomeValue || '').trim();

    if (nome && !this.softwares.map((s) => s.toLowerCase()).includes(nome.toLowerCase())) {
      this.softwares.push(nome);
    }
  }

  removerSoftware(software: string): void {
    const index = this.softwares.indexOf(software);

    if (index >= 0) {
      this.softwares.splice(index, 1);
    }
  }
}

export interface Equipamento {
  nome: string;
  qtd: number;
}
