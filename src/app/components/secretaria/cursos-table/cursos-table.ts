import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Curso } from '../../../models/curso.model';

@Component({
  selector: 'app-cursos-table',
  standalone: false,
  templateUrl: './cursos-table.html',
  styleUrl: './cursos-table.css',
})
export class CursosTable {
  @Input() cursos: Curso[] = [];
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Input() isLoading: boolean = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() editClick = new EventEmitter<Curso>();
  @Output() deleteClick = new EventEmitter<Curso>();
  @Output() clickAdicionarCurso = new EventEmitter<void>();

  searchTerm: string = '';

  onSearchChange(): void {
    this.searchChange.emit(this.searchTerm.trim());
  }

  onEdit(curso: Curso): void {
    this.editClick.emit(curso);
  }

  onDelete(curso: Curso): void {
    this.deleteClick.emit(curso);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  adicionarCurso() {
    this.clickAdicionarCurso.emit();
  }
}
