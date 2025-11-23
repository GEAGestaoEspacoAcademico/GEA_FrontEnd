import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { GetUsuarioResponse } from '../../../types/usuario.type';

@Component({
  selector: 'app-funcionario-table',
  standalone: false,
  templateUrl: './funcionario-table.html',
  styleUrl: './funcionario-table.css',
})
export class FuncionarioTable {
  @Input() data: GetUsuarioResponse[] = [];
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Output() searchChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() editUsuario = new EventEmitter<GetUsuarioResponse>();
  @Output() deleteUsuario = new EventEmitter<GetUsuarioResponse>();
  @Output() clickNovoUsuario = new EventEmitter<void>();

  searchTerm: string = '';

  onSearchChange() {
    this.searchChange.emit(this.searchTerm);
  }

  changePage(page: number) {
    this.pageChange.emit(page);
  }

  onEditUsuario(item: GetUsuarioResponse) {
    this.editUsuario.emit(item);
  }

  onDeleteUsuario(item: GetUsuarioResponse) {
    this.deleteUsuario.emit(item);
  }

  onNovoUsuario() {
    this.clickNovoUsuario.emit();
  }
}
