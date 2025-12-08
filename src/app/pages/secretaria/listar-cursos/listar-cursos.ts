import { BehaviorSubject } from 'rxjs';
import { CursoService } from '../../../services/curso/curso.service';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import type { Curso } from '../../../models/curso.model';
import type { AtualizarCursoRequest, CriarCursoRequest } from '../../../types/curso';
import { CursoForm } from '../../../components/secretaria/curso-form/curso-form';
import { MatDialog } from '@angular/material/dialog';
import type { ConfirmationModal } from '../../../components/modals/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-listar-cursos',
  standalone: false,
  templateUrl: './listar-cursos.html',
  styleUrl: './listar-cursos.css',
})
export class ListarCursos implements OnInit {
  cursoSelecionado!: Curso | null;
  cursoIdParaEditar!: number;

  @ViewChild('deleteModal') deleteModal!: ConfirmationModal;

  private readonly dialog = inject(MatDialog);
  private readonly cursoService = inject(CursoService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly headerService = inject(HeaderTitleService);

  cursos$ = new BehaviorSubject<Curso[]>([]);
  isLoading = false;

  totalPages = 1;
  currentPage = 1;
  searchTerm = '';

  ngOnInit() {
    this.carregarCursos();
    this.headerService.setTitle('Cursos');
    this.headerService.showBack();
  }

  carregarCursos() {
    this.isLoading = true;

    this.cursoService.getCursos().subscribe({
      next: (cursos) => {
        let filtrados = cursos;

        if (this.searchTerm.trim() !== '') {
          const term = this.searchTerm.toLowerCase();
          filtrados = cursos.filter((s) => s.cursoNome.toLowerCase().includes(term));
        }

        const itensPorPagina = 10;
        const start = (this.currentPage - 1) * itensPorPagina;

        this.totalPages = Math.ceil(filtrados.length / itensPorPagina);
        this.cursos$.next(filtrados.slice(start, start + itensPorPagina));
      },
      complete: () => (this.isLoading = false),
    });
  }

  manipularCurso(curso?: Curso) {
    const dialogRef = this.dialog.open(CursoForm, {});

    const instance = dialogRef.componentInstance;

    instance.title = curso ? 'Editar Curso' : 'Novo Curso';
    instance.curso = curso ?? null;

    instance.saved.subscribe(() => {
      dialogRef.close();
      this.carregarCursos();
    });

    instance.closed.subscribe(() => {
      dialogRef.close();
      this.carregarCursos();
    });
  }

  criarCurso(curso: Curso) {
    const criarCurso: CriarCursoRequest = {
      cursoNome: curso.cursoNome,
      coordenadorId: curso.coordenadorId,
      cursoSigla: curso.cursoSigla,
    };
    this.cursoService.criarCurso(criarCurso).subscribe({
      next: () => this.snackBarService.showSuccess('Curso criado com sucesso'),
      error: () => this.snackBarService.showError('Erro ao criar curso'),
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
    this.carregarCursos();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.carregarCursos();
  }

  onDelete(curso: Curso) {
    this.cursoSelecionado = curso;
    this.deleteModal.open();
  }

  confirmDelete() {
    if (!this.cursoSelecionado) {
      return;
    }

    this.cursoService.deleteCurso(this.cursoSelecionado.cursoId).subscribe({
      next: () => this.carregarCursos(),
    });
  }

  onEdit(curso: Curso): void {
    this.cursoIdParaEditar = curso.cursoId;
    this.manipularCurso(curso);
  }
}
