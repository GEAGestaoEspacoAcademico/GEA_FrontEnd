import type { OnInit } from '@angular/core';
import { Component, inject, Input } from '@angular/core';
import { AgendamentoService } from '../../../services/agendamento/agendamento.service';
import { SalaService } from '../../../services/sala/sala.service';
import type { Agendamento, Sala } from '../../../models/agendamento.model';
import { forkJoin } from 'rxjs';
import ProfessorService from '../../../services/professor/professor.service';

@Component({
  selector: 'app-space-schedule-list',
  standalone: false,
  templateUrl: './space-schedule-list.html',
  styleUrl: './space-schedule-list.css',
})
export class SpaceScheduleList implements OnInit {
  @Input() dataSelecionada: Date = new Date('2025-12-15');
  @Input() modoVisualizacao: 'Hoje' | 'Semana' = 'Hoje';
  @Input() filtroTexto: string = '';

  salas: Sala[] = [];
  agendamentos: Agendamento[] = [];
  agendamentosPorSala: Record<number, Agendamento[]> = {};
  professorPorDisciplina: Record<number, string> = {};
  expandedSalas: Record<number, boolean> = {};

  private salaService = inject(SalaService);
  private agendamentoService = inject(AgendamentoService);
  private professorService = inject(ProfessorService);

  ngOnInit() {
    this.carregarDados();
    this.getDisciplinasProfessor();
  }

  getProfessorPorDisciplina(id: number): string {
    return this.professorPorDisciplina[id] ?? 'Professor não definido';
  }

  getDisciplinasProfessor() {
    this.professorService.getProfessores().subscribe((profs) => {
      profs.forEach((prof) => {
        this.professorService.getDisciplinasDoProfessor(prof.usuarioId).subscribe((disciplinas) => {
          disciplinas.forEach((d) => {
            this.professorPorDisciplina[d.disciplinaId] = prof.professorNome;
          });
        });
      });
    });
  }

  carregarDados() {
    const data = this.formatarData(this.dataSelecionada);
    forkJoin({
      salas: this.salaService.getSalas(),
      agendamentos: this.agendamentoService.getAgendamentoPorData(data),
    }).subscribe(({ salas, agendamentos }) => {
      this.salas = salas;
      this.agendamentos = agendamentos;
      this.agruparPorSala();
    });
  }

  get salasFiltradas() {
    return (this.agendamentosPorSala ? Object.entries(this.agendamentosPorSala) : [])
      .filter(([salaId]) => {
        const nomeSala = this.getNomeSala(+salaId).toLowerCase();
        return nomeSala.includes(this.filtroTexto.toLowerCase());
      })
      .map(([key, value]) => ({ key, value }));
  }

  getNomeSala(id: number): string {
    const sala = this.salas.find((s) => s.salaId === id);
    return sala!.salaNome;
  }

  agruparPorSala() {
    this.agendamentosPorSala = {};

    for (const sala of this.salas) {
      const ags = this.agendamentos.filter((a) => a.sala.salaId === sala.salaId);

      if (ags.length > 0) {
        this.agendamentosPorSala[sala.salaId] = ags;
      }
    }
  }

  formatarData(d: Date): string {
    return d.toISOString().split('T')[0];
  }
}
