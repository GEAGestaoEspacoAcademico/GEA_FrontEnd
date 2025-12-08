import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import type { Professor } from '../../../models/professor.model';
import ProfessorService from '../../../services/professor/professor.service';
import { debounceTime } from 'rxjs';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';

@Component({
  selector: 'app-calendario',
  standalone: false,
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario implements OnInit {
  search = new FormControl('');
  professores: Professor[] = [];
  professoresFiltrados: Professor[] = [];
  professorSelecionado: Professor | null = null;
  dataSelecionada: Date = new Date();
  modoVisualizacao: 'Hoje' | 'Semana' = 'Semana';
  filtroTexto: string = '';
  mostrarLista = false;

  private professorService = inject(ProfessorService);
  private titleService = inject(HeaderTitleService);

  ngOnInit(): void {
    this.professorService.getProfessores().subscribe((res) => {
      this.professores = res;
      this.professoresFiltrados = res;
    });

    this.search.valueChanges.pipe(debounceTime(200)).subscribe((valor) => {
      this.filtrarProfessores(valor ?? '');
    });

    this.titleService.showBack();
    this.titleService.setTitle('');
  }

  filtrarProfessores(valor: string): void {
    const termo = valor?.toLowerCase().trim() || '';

    this.professoresFiltrados = this.professores.filter((p) =>
      p.professorNome.toLowerCase().includes(termo),
    );
    const selecionado = this.professores.find((p) => p.professorNome.toLowerCase() === termo);

    if (selecionado) {
      this.selecionarProfessor(selecionado);
    }
  }

  selecionarProfessor(professor: Professor): void {
    this.professorSelecionado = professor;
    this.filtroTexto = professor.professorNome;
  }

  alterarModo(modo: 'Hoje' | 'Semana') {
    this.modoVisualizacao = modo;
  }

  onFocusBusca() {
    this.mostrarLista = true;
  }

  onBlurBusca() {
    setTimeout(() => {
      this.mostrarLista = false;
    }, 150);
  }
}
