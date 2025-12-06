import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import type { ConfirmationModal } from '../../../components/modals/confirmation-modal/confirmation-modal';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import type { GetUsuarioResponse } from '../../../types/usuario.type';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import type { EditProfessorModal } from '../../../components/secretaria/edit-professor-modal/edit-professor-modal';
import { Store } from '@ngrx/store';
import { filter, take, type Observable } from 'rxjs';
import { selectUserId } from '../../../store/auth/auth.selectors';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-funcionarios',
  standalone: false,
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css',
})
export class Funcionarios implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal!: ConfirmationModal;
  @ViewChild('modalEditar') modalEditar!: EditProfessorModal;

  private usuarioService = inject(UsuarioService);
  private headerService = inject(HeaderTitleService)
  private store = inject(Store);
  private snackbarService = inject(SnackBarService);

  funcionarioParaDeletar!: GetUsuarioResponse | null;
  currentUserId$: Observable<number | undefined> = this.store.select(selectUserId);
  currentUserId!: number;

  masterFuncionarioList: GetUsuarioResponse[] = [];
  displayedFuncionarios: GetUsuarioResponse[] = [];

  currentPage = 1;
  totalPages = 1;
  searchTerm = '';
  pageSize = 7;

  ngOnInit(): void {
    this.headerService.setTitle('Funcionários')
    this.headerService.showBack()
    this.listarUsuario()
    this.currentUserId$.pipe(
      filter((userId) => !!userId), 
      take(1)
    ).subscribe({
      next: (userId) => {
        if(!userId) {return}
        this.currentUserId = userId; 
      },
      error: (_) => this.snackbarService.showError("Erro ao carregar usuário")
    });
  }

  listarUsuario(){
    this.usuarioService.listarUsuarios().subscribe({
      next: (result: GetUsuarioResponse[]) => {
        this.masterFuncionarioList = result;
        this.atualizarDataVisualizada();
      },
      error: (err) => console.error('Erro ao carregar usuários:', err),
    });
  }

  openDeleteModal(funcionario: GetUsuarioResponse): void {
    if(funcionario.usuarioId === this.currentUserId) {
      this.snackbarService.showError("Não é possível excluir o seu usuário atual")
      return;
    }
    this.funcionarioParaDeletar = funcionario;
    this.confirmDeleteModal.open();
  }

  confirmDelete(): void {
    if (!this.funcionarioParaDeletar) {
      return;
    }

    this.usuarioService.deletar(this.funcionarioParaDeletar.usuarioId).subscribe({
      next: () => {
        this.masterFuncionarioList = this.masterFuncionarioList.filter(
          (f) => f.usuarioId !== this.funcionarioParaDeletar!.usuarioId,
        );
        this.listarUsuario();
        this.funcionarioParaDeletar = null;
        this.snackbarService.showSuccess("Funcionário deletado com sucesso")
      },
      error: (_) => this.snackbarService.showError('Erro ao deletar funcionário:'),
    });
  }

  closeModal(): void {
    this.funcionarioParaDeletar = null;
  }

  atualizarDataVisualizada(): void {
    let filtrada = this.masterFuncionarioList;

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtrada = filtrada.filter((f) => f.usuarioNome.toLowerCase().includes(term));
    }

    this.totalPages = Math.ceil(filtrada.length / this.pageSize) || 1;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.displayedFuncionarios = filtrada.slice(start, end);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.atualizarDataVisualizada();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.atualizarDataVisualizada();
  }

  onEditFuncionario(funcionario: GetUsuarioResponse): void {
    this.modalEditar.abrirInstaciaModal(funcionario.usuarioId);
    this.listarUsuario()
  }
}
