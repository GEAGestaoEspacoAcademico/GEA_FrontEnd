import { Component, inject, Input, type OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AgendamentoService } from '../../../services/agendamento/agendamento.service';
import { SalaService } from '../../../services/sala/sala.service';
import ProfessorService from '../../../services/professor/professor.service';
import type { Agendamento, Sala } from '../../../models/agendamento.model';

@Component({
  selector: 'app-professor-schedule-list',
  standalone: false,
  templateUrl: './professor-schedule-list.html',
  styleUrl: './professor-schedule-list.css',
})
export class ProfessorScheduleList implements OnInit {
  @Input() dataSelecionada: Date = new Date();
  @Input() modoVisualizacao!: 'Hoje' | 'Semana';
  @Input() filtroTexto: string = '';

  salas: Sala[] = [];
  agendamentos: Agendamento[] = [];

  agendamentosPorProfessor: Record<string, Agendamento[]> = {};

  agendamentosPorDiaProfessor: Record<string, Record<string, Agendamento[]>> = {};

  diasSemana: Array<{ data: Date; iso: string; nome: string }> = [];

  professorPorDisciplina: Record<number, string> = {};

  expandedProfessor: Record<string, boolean> = {};

  private salaService = inject(SalaService);
  private agendamentoService = inject(AgendamentoService);
  private professorService = inject(ProfessorService);

  ngOnInit() {
    this.iniciarCarregamento();
  }

  iniciarCarregamento() {
    this.professorService.getProfessores().subscribe((profs) => {
      const requests = profs.map((prof) =>
        this.professorService.getDisciplinasDoProfessor(prof.usuarioId),
      );

      forkJoin(requests).subscribe((respostasDisciplinas) => {
        respostasDisciplinas.forEach((disciplinas, index) => {
          const nomeProfessor = profs[index].professorNome;
          disciplinas.forEach((d) => {
            this.professorPorDisciplina[d.disciplinaId] = nomeProfessor;
          });
        });

        this.carregarAgendamentos();
      });
    });
  }

  carregarAgendamentos() {
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
      this.agendamentos = agendamentos || [];

      this.agendamentosPorProfessor = this.agruparPorProfessor(this.agendamentos);
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
      this.agendamentosPorDiaProfessor = {};

      dias.forEach((ags, i) => {
        const iso = this.diasSemana[i].iso;
        const lista = Array.isArray(ags) ? ags : [];
        // Agrupa por professor dentro daquele dia
        this.agendamentosPorDiaProfessor[iso] = this.agruparPorProfessor(lista);
      });
    });
  }

  private agruparPorProfessor(lista: Agendamento[]) {
    const map: Record<string, Agendamento[]> = {};

    if (!Array.isArray(lista)) {
      return map;
    }

    for (const ag of lista) {
      const nomeProfessor = this.getProfessorPorDisciplina(ag.disciplinaId);

      if (!map[nomeProfessor]) {
        map[nomeProfessor] = [];
      }
      map[nomeProfessor].push(ag);
    }

    return map;
  }

  getProfessorPorDisciplina(id: number): string {
    return this.professorPorDisciplina[id] ?? 'Sem Professor Definido';
  }

  getNomeSala(id: number): string {
    const sala = this.salas.find((s) => s.salaId === id);
    return sala ? sala.salaNome : 'Sala desconhecida';
  }

  get professoresFiltradosHoje() {
    return Object.entries(this.agendamentosPorProfessor)
      .filter(([nomeProfessor]) =>
        nomeProfessor.toLowerCase().includes(this.filtroTexto.toLowerCase()),
      )
      .map(([key, value]) => ({ key, value }));
  }

  getProfessoresDoDia(iso: string) {
    const dadosDia = this.agendamentosPorDiaProfessor[iso];
    if (!dadosDia) {
      return [];
    }

    return Object.entries(dadosDia)
      .filter(([nomeProfessor]) =>
        nomeProfessor.toLowerCase().includes(this.filtroTexto.toLowerCase()),
      )
      .map(([key, value]) => ({ key, value }));
  }

  private calcularSemana() {
    const base = new Date(this.dataSelecionada);
    const diaSemana = base.getDay();
    const diff = base.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
    const segunda = new Date(base.setDate(diff));

    this.diasSemana = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(segunda);
      d.setDate(segunda.getDate() + i);
      const iso = this.formatarData(d);

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
