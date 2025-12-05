import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import type { Disciplina } from '../../../models/disciplina.model';
import { DisciplinaService } from '../../../services/disciplina/disciplina.service';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import { BehaviorSubject } from 'rxjs';
import type { AtualizarDisciplinaRequest, CriarDisciplinaRequest } from '../../../types/disciplina.model';

@Component({
  selector: 'app-listar-disciplinas',
  standalone: false,
  templateUrl: './listar-disciplinas.html',
  styleUrl: './listar-disciplinas.css',
})
export class ListarDisciplinas implements OnInit {
  disciplinaSelecionado!: Disciplina | null;
  disciplinaIdParaEditar!: number;

  private readonly disciplinaService = inject(DisciplinaService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly headerService = inject(HeaderTitleService);

  disciplinas$ = new BehaviorSubject<Disciplina[]>([]);
  isLoading = false;

  totalPages = 1;
  currentPage = 1;
  searchTerm = '';

  ngOnInit() {
    this.carregarDisciplinas();
    this.headerService.setTitle('Disciplinas');
    this.headerService.showBack();
  }

  carregarDisciplinas() {
    this.isLoading = true;

    this.disciplinaService.getDisciplinas().subscribe({
      next: (disciplinas) => {
        let filtrados = disciplinas;

        if (this.searchTerm.trim() !== '') {
          const term = this.searchTerm.toLowerCase();
          filtrados = disciplinas.filter((s) => s.disciplinaNome.toLowerCase().includes(term));
        }

        const itensPorPagina = 10;
        const start = (this.currentPage - 1) * itensPorPagina;

        this.totalPages = Math.ceil(filtrados.length / itensPorPagina);
        this.disciplinas$.next(filtrados.slice(start, start + itensPorPagina));
      },
      complete: () => (this.isLoading = false),
    });
  }

  adicionarDisciplina() {
    //chamar modal
  }

  criarDisciplina(disciplina: Disciplina) {
    const criarDisciplina: CriarDisciplinaRequest = {
      cursoId: 1, //mudar depois
      disciplinaNome: disciplina.disciplinaNome,
      disciplinaSemestre: disciplina.disciplinaSemestre,
    };
    this.disciplinaService.criarDisciplina(criarDisciplina).subscribe({
      next: () => this.snackBarService.showSuccess('Disciplina criada com sucesso'),
      error: () => this.snackBarService.showError('Erro ao criar disciplina'),
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
    this.carregarDisciplinas();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.carregarDisciplinas();
  }

  onDelete(disciplina: Disciplina) {
    this.disciplinaSelecionado = disciplina;
    //chamar modal
  }

  confirmDelete() {
    if (!this.disciplinaSelecionado) {
      return;
    }

    this.disciplinaService.deleteDisciplina(this.disciplinaSelecionado.disciplinaId).subscribe({
      next: () => this.carregarDisciplinas(),
    });
  }

  onEdit(disciplina: Disciplina): void {
    this.disciplinaIdParaEditar = disciplina.disciplinaId;
  }

  onModalEdit(disciplina: AtualizarDisciplinaRequest): void {
    // if (this.disciplinaIdEditar) {
    //   this.disciplinaService.editDisciplina(this.disciplinaIdEditar, disciplina).subscribe({
    //     next: () => {
    //       this.snackBarService.showSuccess('Disciplina atualizada com sucesso');
    //       this.carregarDisciplinas();
    //     },
    //   });
    // }
  }
}
