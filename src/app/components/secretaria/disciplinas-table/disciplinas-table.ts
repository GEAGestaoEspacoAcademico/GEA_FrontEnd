import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Disciplina } from '../../../models/disciplina.model';
import type { Curso } from '../../../models/curso.model';

@Component({
  selector: 'app-disciplinas-table',
  standalone: false,
  templateUrl: './disciplinas-table.html',
  styleUrl: './disciplinas-table.css',
})
export class DisciplinasTable {
  @Input() disciplinas: Disciplina[] = [];
  @Input() cursos: Curso[] = [];
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Input() isLoading: boolean = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() selecionaCurso = new EventEmitter<string | null>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() editClick = new EventEmitter<Disciplina>();
  @Output() deleteClick = new EventEmitter<Disciplina>();
  @Output() clickAdicionarDisciplina = new EventEmitter<void>();

  searchTerm: string = '';
  cursoSelecionado: string | null = null;

  emitirSelecao() {
    this.selecionaCurso.emit(this.cursoSelecionado);
  }

  onSearchChange(): void {
    this.searchChange.emit(this.searchTerm.trim());
  }

  onEdit(disciplina: Disciplina): void {
    this.editClick.emit(disciplina);
  }

  onDelete(disciplina: Disciplina): void {
    this.deleteClick.emit(disciplina);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  adicionarDisciplina() {
    this.clickAdicionarDisciplina.emit();
  }
}
