import type { OnInit} from '@angular/core';
import { Component, inject, ViewChild} from '@angular/core';
import type { ConfirmationModal } from '../../../components/shared/confirmation-modal/confirmation-modal';
import type { EditarEspacoModal } from '../../../components/modals/editar-espaco-modal/editar-espaco-modal';
import type { Sala } from '../../../models/sala.model';
import { SalaService } from '../../../services/salas/sala.service';
import { BehaviorSubject } from 'rxjs';

interface SalaUpdateDTO {
  tipoSalaId: number; // Supondo que o tipoSala do form é o ID
  salaNome: string;
  salaCapacidade: number;
  piso: number;
  disponibilidade: boolean;
  salaObservacoes: string;
  // **Removendo materias**, pois o DTO do Spring não o tem.
}

@Component({
  selector: 'app-lista-espacos',
  standalone: false,
  templateUrl: './lista-espacos.html',
  styleUrl: './lista-espacos.css'
})
export class ListaEspacos implements OnInit{
  @ViewChild('deleteModal') deleteModal!: ConfirmationModal;
  @ViewChild('editModal') editModal!: EditarEspacoModal;

  salaSelecionada!: Sala | null;

  private salaService = inject(SalaService);

  espacos$ = new BehaviorSubject<Sala[]>([]);
  isLoading = false;

  totalPages = 1;
  currentPage = 1;
  searchTerm = '';

  ngOnInit() {
    this.carregarEspacos();
  }

  carregarEspacos() {
    this.isLoading = true;

    this.salaService.getSalasComuns().subscribe({
      next: (sala) => {
        let filtrados = sala;

        if(this.searchTerm.trim() !== '') {
          const term = this.searchTerm.toLowerCase();
          filtrados = sala.filter(s =>
            s.salaNome.toLowerCase().includes(term)
          );
        }

        const itensPorPagina = 10;
        const start = (this.currentPage - 1) * itensPorPagina;

        this.totalPages =Math.ceil(filtrados.length / itensPorPagina);
        this.espacos$.next(filtrados.slice(start, start + itensPorPagina));
      },
      complete: () => (this.isLoading = false)
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
    this.carregarEspacos();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.carregarEspacos();
  }

  onDelete(espaco: Sala) {
    this.salaSelecionada = espaco;
    this.deleteModal.open();
  }

  confirmDelete() {
    if(!this.salaSelecionada) {return}

    this.salaService.deleteSala(this.salaSelecionada.salaId).subscribe({
      next: () => this.carregarEspacos()
    });
  }

  onEdit(sala: Sala): void {
    this.editModal.open(sala);
  }

  onModalEdit(sala: Sala): void {
    this.salaService.updateSala(sala.salaId, sala).subscribe({
      next: () => this.carregarEspacos()
    })
  }
}
