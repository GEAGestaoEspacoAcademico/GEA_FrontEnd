import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import type { Sala } from '../../models/sala.model';
import { SalaService } from '../../services/salas/sala.service';
import type { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-space-management',
  standalone: false,
  templateUrl: './space-management.html',
  styleUrl: './space-management.css'
})
export class SpaceManagement implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal!: ConfirmationModal;
  salaParaDeletar!: Sala | null;
  
  private salaService = inject(SalaService);

  masterSalaList: Sala[] = [];
  displayedSalas: Sala[] = [];

  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';
  pageSize: number = 7;

  

  ngOnInit(): void {
    this.salaService.getLaboratorios().subscribe({
      next: (labs) => {
        this.masterSalaList = labs;
        this.atualizarDataVisualizada();
      },
      error: (err) => console.error('Erro ao carregar laboratórios:', err)
    });
  }

  openDeleteModal(sala: Sala) {
    this.salaParaDeletar = sala;
    this.confirmDeleteModal.open();
  }

  confirmDelete(): void {
    if (!this.salaParaDeletar) {return};

    this.salaService.deleteSala(this.salaParaDeletar.salaId).subscribe({
      next: () => {
        this.masterSalaList = this.masterSalaList.filter(
          s => s.salaId !== this.salaParaDeletar!.salaId
        );
        this.atualizarDataVisualizada();
        this.salaParaDeletar = null;
      },
      error: (err) => console.error('Erro ao deletar sala:', err)
    });
  }

  closeModal(): void {
    this.salaParaDeletar = null;
  }

  atualizarDataVisualizada(): void {
    let filtrada = this.masterSalaList;

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtrada = filtrada.filter(s =>
        s.salaNome.toLowerCase().includes(term)
      );
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

  onEditSala(sala: Sala): void {
    console.log('Editar sala ID:', sala.salaId);
  }
}
