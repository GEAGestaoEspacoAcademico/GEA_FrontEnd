import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Sala } from '../../../models/sala.model';

@Component({
  selector: 'app-espacos-table',
  standalone: false,
  templateUrl: './espacos-table.html',
  styleUrl: './espacos-table.css'
})
export class EspacosTable {
  @Input() data: Sala[] = [];
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Input() isLoading: boolean = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() editClick = new EventEmitter<Sala>();
  @Output() deleteClick = new EventEmitter<Sala>();

  searchTerm: string = '';

  onSearchChange(): void {
    this.searchChange.emit(this.searchTerm.trim());
  }

  onEdit(sala: Sala): void {
    this.editClick.emit(sala);
  }

  onDelete(sala: Sala): void {
    this.deleteClick.emit(sala);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
