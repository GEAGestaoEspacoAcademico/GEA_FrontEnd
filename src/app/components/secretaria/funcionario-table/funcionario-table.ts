import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Funcionario } from '../../../models/funcionario.model';

@Component({
  selector: 'app-funcionario-table',
  standalone: false,
  templateUrl: './funcionario-table.html',
  styleUrl: './funcionario-table.css'
})
export class FuncionarioTable {

  @Input() data: Funcionario[] = [];
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Output() searchChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() editFuncionario = new EventEmitter<Funcionario>();
  @Output() deleteFuncionario = new EventEmitter<Funcionario>();
  @Output() clickNovoFuncionario = new EventEmitter<void>();


  searchTerm: string = '';

  onSearchChange() {
    this.searchChange.emit(this.searchTerm);
  }

  
  changePage(page: number) {
    this.pageChange.emit(page);
  }

  onEditFuncionario(item: Funcionario) {
    this.editFuncionario.emit(item);
  }

  onDeleteFuncionario(item: Funcionario) {
    this.deleteFuncionario.emit(item);
  }

  onNovoFuncionario() {
    this.clickNovoFuncionario.emit();
  }
}
