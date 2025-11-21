import type { OnInit} from '@angular/core';
import { Component, inject, ViewChild} from '@angular/core';
import type { ConfirmationModal } from '../../../components/shared/confirmation-modal/confirmation-modal';
import type { EditarEspacoModal } from '../../../components/modals/editar-espaco-modal/editar-espaco-modal';
import type { Sala } from '../../../models/sala.model';
import { BehaviorSubject } from 'rxjs';
import { SalaService } from '../../../services/sala/sala.service';
import type { AtualizarSalaRequest } from '../../../types/sala.type';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';

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
  salaIdEditar!: number; 

  private salaService = inject(SalaService);
  private snackBarService = inject(SnackBarService)

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

    this.salaService.getSalas().subscribe({
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
    this.salaIdEditar = sala.salaId
    this.editModal.open(sala);
  }

  onModalEdit(sala: AtualizarSalaRequest): void {
    if(this.salaIdEditar){
      this.salaService.editSala(this.salaIdEditar, sala).subscribe({
        next: () => {
          this.snackBarService.showSuccess("Sala atualizada com sucesso")
          this.carregarEspacos()
        }
      })
    }
  }
}
