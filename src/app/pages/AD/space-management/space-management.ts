import type { OnInit } from '@angular/core';
import { Component, inject, viewChild, ViewChild } from '@angular/core';
import type { Sala } from '../../../models/sala.model';
import { SalaService } from '../../../services/sala/sala.service';
import type { ConfirmationModal } from '../../../components/modals/confirmation-modal/confirmation-modal';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import type { EditarEspacoModal } from '../../../components/modals/editar-espaco-modal/editar-espaco-modal';
import type { AtualizarSalaRequest } from '../../../types/sala.type';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import type { CreateResourceModal } from '../../../components/modals/create-resource-modal/create-resource-modal';
import { RecursoService } from '../../../services/recurso/recurso.service';
import type { CriarRecursoRequest } from '../../../types/recurso.type';

@Component({
  selector: 'app-space-management',
  standalone: false,
  templateUrl: './space-management.html',
  styleUrl: './space-management.css',
})
export class SpaceManagement implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal!: ConfirmationModal;
  @ViewChild('editModal') editModal!: EditarEspacoModal;
  @ViewChild('criarRecursoId') criarRecursoModal!: CreateResourceModal;

  salaParaDeletar!: Sala | null;
  salaIdEditar!: number

  private salaService = inject(SalaService);
  private recursoService = inject(RecursoService)
  private headerService = inject(HeaderTitleService);
  private snackBarService = inject(SnackBarService)

  masterSalaList: Sala[] = [];
  displayedSalas: Sala[] = [];

  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';
  pageSize: number = 7;

  ngOnInit(): void {
    this.carregarSalas()
    this.headerService.setTitle('Lista de Espaços Acadêmicos')
    this.headerService.showBack()
  }

  criarRecurso(recurso: { type: string; name: string }){

    const corpoCriarRecurso: CriarRecursoRequest = {
      recursoNome: recurso.name,
      recursoTipoId: recurso.type === 'SOFTWARE' ? 2 : 1
    }
    this.recursoService.criarRecurso(corpoCriarRecurso).subscribe({
      next: () => this.snackBarService.showSuccess("Recurso criado com sucesso"),
      error: () => this.snackBarService.showError("Erro ao crari recurso")
    })
  }

  carregarSalas() {
    this.salaService.getSalas().subscribe({
      next: (labs) => {
        this.masterSalaList = labs;
        this.atualizarDataVisualizada();
      },
      error: (err) => console.error('Erro ao carregar laboratórios:', err),
    });
  }
  onEditSala(sala: Sala): void {
    this.salaIdEditar = sala.salaId
    this.editModal.open(sala);
  }

  onModalEdit(sala: AtualizarSalaRequest): void {
    if(this.salaIdEditar){
      this.salaService.editSala(this.salaIdEditar, sala).subscribe({
        next: () => {
          this.snackBarService.showSuccess("Sala atualizada com sucesso")
          this.carregarSalas()
        }
      })
    }
  }

  criarEquipamento(tipo: 'SOFTWARE' | 'HARDWARE'){
    this.criarRecursoModal.open(tipo)
  }

  openDeleteModal(sala: Sala) {
    this.salaParaDeletar = sala;
    this.confirmDeleteModal.open();
  }

  confirmDelete(): void {
    if (!this.salaParaDeletar) {
      return;
    }

    this.salaService.deleteSala(this.salaParaDeletar.salaId).subscribe({
      next: () => {
        this.masterSalaList = this.masterSalaList.filter(
          (s) => s.salaId !== this.salaParaDeletar!.salaId,
        );
        this.atualizarDataVisualizada();
        this.snackBarService.showSuccess("Sala deletada com sucesso!");
        this.salaParaDeletar = null;
      },
      error: (err) => {
        console.error('Erro ao deletar sala:', err);
        this.snackBarService.showError("Erro ao deletar sala.")
      }
    });
  }

  closeModal(): void {
    this.salaParaDeletar = null;
  }

  atualizarDataVisualizada(): void {
    let filtrada = this.masterSalaList;

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtrada = filtrada.filter((s) => s.salaNome.toLowerCase().includes(term));
    }

    this.totalPages = Math.ceil(filtrada.length / this.pageSize) || 1;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.displayedSalas = filtrada.slice(start, end);
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
}
