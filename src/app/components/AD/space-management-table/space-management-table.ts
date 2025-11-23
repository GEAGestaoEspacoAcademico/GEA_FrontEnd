import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Sala } from '../../../models/sala.model';

@Component({
  selector: 'app-space-management-table',
  standalone: false,
  templateUrl: './space-management-table.html',
  styleUrl: './space-management-table.css'
})
export class SpaceManagementTable {
  @Input() data: Sala[] = [];
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;

  @Output() searchChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() editSala = new EventEmitter<Sala>();
  @Output() deleteSala = new EventEmitter<Sala>();
  @Output() clickNovoSoftware = new EventEmitter<void>();
  @Output() clickNovoEquipamento = new EventEmitter<void>();

  searchTerm: string = '';

  onSearchChange() {
    this.searchChange.emit(this.searchTerm.trim());
  }

  onEditSala(sala: Sala) {
    this.editSala.emit(sala);
  }

  onDeleteSala(sala: Sala) {
    this.deleteSala.emit(sala);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
  onNovoSoftware() {
    this.clickNovoSoftware.emit();
  }

  onNovoEquipamento() {
    this.clickNovoEquipamento.emit();
  }
}
