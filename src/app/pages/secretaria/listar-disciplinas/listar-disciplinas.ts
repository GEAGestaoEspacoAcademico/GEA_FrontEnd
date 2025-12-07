import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import type { Disciplina } from '../../../models/disciplina.model';
import { DisciplinaService } from '../../../services/disciplina/disciplina.service';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import { BehaviorSubject } from 'rxjs';
import { DisciplinaForm } from '../../../components/secretaria/disciplina-form/disciplina-form';
import { MatDialog } from '@angular/material/dialog';
import type {
  AtualizarDisciplinaRequest,
  CriarDisciplinaRequest,
} from '../../../types/disciplina.model';
import { CursoService } from '../../../services/curso/curso.service';
import type { Curso } from '../../../models/curso.model';
import type { ConfirmationModal } from '../../../components/modals/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-listar-disciplinas',
  standalone: false,
  templateUrl: './listar-disciplinas.html',
  styleUrl: './listar-disciplinas.css',
})
export class ListarDisciplinas implements OnInit {
  disciplinaSelecionado!: Disciplina | null;
  disciplinaIdParaEditar!: number;
  cursos: Curso[] = [];

  private readonly dialog = inject(MatDialog);
  private readonly disciplinaService = inject(DisciplinaService);
  private readonly cursoService = inject(CursoService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly headerService = inject(HeaderTitleService);

  @ViewChild('deleteModal') deleteModal!: ConfirmationModal;

  disciplinas$ = new BehaviorSubject<Disciplina[]>([]);
  isLoading = false;
  filtroCursoNome: string | null = null;

  totalPages = 1;
  currentPage = 1;
  searchTerm = '';

  ngOnInit() {
    this.carregarDisciplinas();
    this.carregarCursos();
    this.headerService.setTitle('Disciplinas');
    this.headerService.showBack();
  }

  carregarDisciplinas() {
    this.isLoading = true;

    this.disciplinaService.getDisciplinas().subscribe({
      next: (disciplinas) => {
        let filtrados = disciplinas;
        if (this.filtroCursoNome) {
          filtrados = filtrados.filter((d) => d.cursoNome === this.filtroCursoNome);
        }

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

  manipularDisciplina(disciplina?: Disciplina) {
    const dialogRef = this.dialog.open(DisciplinaForm, {});

    const instance = dialogRef.componentInstance;

    instance.title = disciplina ? 'Editar Disciplina' : 'Nova Disciplina';
    instance.disciplina = disciplina ?? null;

    instance.saved.subscribe(() => {
      dialogRef.close();
    });

    instance.closed.subscribe(() => {
      dialogRef.close();
    });
  }
  carregarCursos() {
    this.isLoading = true;

    this.cursoService.getCursos().subscribe({
      next: (cursos) => (this.cursos = cursos),
    });
  }

  onSelecionaCurso(cursonome: string | null) {
    this.filtroCursoNome = cursonome;
    this.currentPage = 1;
    this.carregarDisciplinas();
  }

  adicionarDisciplina() {
    this.manipularDisciplina();
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
    this.deleteModal.open();
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
    this.manipularDisciplina(disciplina);
  }
}
