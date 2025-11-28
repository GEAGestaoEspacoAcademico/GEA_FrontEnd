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
  @Input() dataSelecionada: Date = new Date();
  @Input() modoVisualizacao!: 'Hoje' | 'Semana';
  @Input() filtroTexto!: string;

  salas: Sala[] = [];
  agendamentos: Agendamento[] = [];
  agendamentosPorSala: Record<number, Agendamento[]> = {};
  agendamentosPorDia: Record<string, Record<number, Agendamento[]>> = {};
  diasSemana: Array<{ data: Date; iso: string; nome: string }> = [];
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
    if (this.modoVisualizacao === 'Hoje') {
      this.carregarHoje();
    } else {
      this.carregarSemana();
    }
  }

  private carregarHoje() {
    const data = this.formatarData(this.dataSelecionada);

    forkJoin({
      salas: this.salaService.getSalas(),
      agendamentos: this.agendamentoService.getAgendamentoPorData(data),
    }).subscribe(({ salas, agendamentos }) => {
      this.salas = salas;
      this.agendamentos = agendamentos;

      this.agendamentosPorSala = this.agruparPorSala(this.agendamentos ?? []);
    });
  }

  private carregarSemana() {
    this.calcularSemana();

    forkJoin({
      salas: this.salaService.getSalas(),
      dias: forkJoin(
        this.diasSemana.map((d) => this.agendamentoService.getAgendamentoPorData(d.iso)),
      ),
    }).subscribe(({ salas, dias }) => {
      this.salas = salas;

      this.agendamentosPorDia = {};

      dias.forEach((ags, i) => {
        const iso = this.diasSemana[i].iso;

        this.agendamentosPorDia[iso] = this.agruparPorSala(ags);
      });
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

  private agruparPorSala(lista: Agendamento[]) {
    const map: Record<number, Agendamento[]> = {};

    for (const ag of lista) {
      const salaId = ag.sala.salaId;
      if (!map[salaId]) {
        map[salaId] = [];
      }
      map[salaId].push(ag);
    }

    return map;
  }

  private calcularSemana() {
    const base = new Date(this.dataSelecionada);
    const diaSemana = base.getDay();

    const segunda = new Date(base);
    segunda.setDate(base.getDate() - ((diaSemana + 6) % 7));

    this.diasSemana = [];

    for (let i = 0; i < 6; i++) {
      const d = new Date(segunda);
      d.setDate(segunda.getDate() + i);

      const iso = d.toISOString().split('T')[0];

      this.diasSemana.push({
        data: d,
        iso,
        nome: d.toLocaleDateString('pt-BR', { weekday: 'long' }),
      });
    }
  }

  formatarData(d: Date): string {
    return d.toISOString().split('T')[0];
  }
}
