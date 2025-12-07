import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import type { ConfirmationModal } from '../../../components/modals/confirmation-modal/confirmation-modal';
import type { EditarEspacoModal } from '../../../components/modals/editar-espaco-modal/editar-espaco-modal';
import type { Sala } from '../../../models/sala.model';
import { BehaviorSubject } from 'rxjs';
import { SalaService } from '../../../services/sala/sala.service';
import type { AtualizarSalaRequest } from '../../../types/sala.type';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import type { CriarRecursoRequest } from '../../../types/recurso.type';
import type { CreateResourceModal } from '../../../components/modals/create-resource-modal/create-resource-modal';
import { RecursoService } from '../../../services/recurso/recurso.service';
import type { SpaceFilterType } from '../../../types/space-filter.type';

@Component({
  selector: 'app-lista-espacos',
  standalone: false,
  templateUrl: './lista-espacos.html',
  styleUrl: './lista-espacos.css',
})
export class ListaEspacos implements OnInit {
  @ViewChild('deleteModal') deleteModal!: ConfirmationModal;
  @ViewChild('editModal') editModal!: EditarEspacoModal;
  @ViewChild('criarRecursoId') criarRecursoModal!: CreateResourceModal;

  salaSelecionada!: Sala | null;
  salaIdEditar!: number;

  private salaService = inject(SalaService);
  private snackBarService = inject(SnackBarService);
  private headerService = inject(HeaderTitleService);
  private recursoService = inject(RecursoService);

  espacos$ = new BehaviorSubject<Sala[]>([]);
  isLoading = false;
  mostrarFiltro = false;

  totalPages = 1;
  currentPage = 1;
  searchTerm = '';

  filtrosAtivos: SpaceFilterType = {
    tipos: [],
    pisos: [],
    status: [],
  };

  ngOnInit() {
    this.carregarEspacos();
    this.headerService.setTitle('Lista de Espaços Acadêmicos');
    this.headerService.showBack();
  }

  carregarEspacos() {
    this.isLoading = true;

    this.salaService.getSalas().subscribe({
      next: (salas) => {
        let filtrados = salas.filter(s => s.tipoSalaId === 1);

        if (this.searchTerm.trim() !== '') {
          const term = this.searchTerm.toLowerCase();
          filtrados = filtrados.filter((s) => s.salaNome.toLowerCase().includes(term));
        }

        if (this.filtrosAtivos.tipos.length) {
          filtrados = filtrados.filter((s) => this.filtrosAtivos.tipos.includes(s.tipoSalaId));
        }

        if (this.filtrosAtivos.pisos.length > 0) {
          filtrados = filtrados.filter((s) => this.filtrosAtivos.pisos.includes(s.piso.pisoNome));
        }

        if (this.filtrosAtivos.status.length) {
          filtrados = filtrados.filter((s) =>
            this.filtrosAtivos.status.includes(s.disponibilidade ? 'DISPONIVEL' : 'INDISPONIVEL'),
          );
        }

        const itensPorPagina = 10;
        const start = (this.currentPage - 1) * itensPorPagina;

        this.totalPages = Math.ceil(filtrados.length / itensPorPagina);
        this.espacos$.next(filtrados.slice(start, start + itensPorPagina));
      },
      complete: () => (this.isLoading = false),
    });
  }

  onFilterChange(filtro: SpaceFilterType) {
    this.filtrosAtivos = filtro;
    this.currentPage = 1;
    this.carregarEspacos();
  }

  toggleFiltro() {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

  adicionarEquipamento() {
    this.criarRecursoModal.open('SOFTWARE');
  }

  criarRecurso(recurso: { type: string; name: string }) {
    const corpoCriarRecurso: CriarRecursoRequest = {
      recursoNome: recurso.name,
      recursoTipoId: recurso.type === 'SOFTWARE' ? 2 : 1,
    };
    this.recursoService.criarRecurso(corpoCriarRecurso).subscribe({
      next: () => this.snackBarService.showSuccess('Recurso criado com sucesso'),
      error: () => this.snackBarService.showError('Erro ao criar recurso'),
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
    if (!this.salaSelecionada) {
      return;
    }

    this.salaService.deleteSala(this.salaSelecionada.salaId).subscribe({
      next: () => {
        this.carregarEspacos()
        this.snackBarService.showSuccess("Sala deletada com sucesso!");
      },
      error: (erro) =>{
        console.log(erro);
        this.snackBarService.showError("Erro ao deletar sala!");
      }
    });
  }

  onEdit(sala: Sala): void {
    this.salaIdEditar = sala.salaId;
    this.editModal.open(sala);
  }

  onModalEdit(sala: AtualizarSalaRequest): void {
    if (this.salaIdEditar) {
      this.salaService.editSala(this.salaIdEditar, sala).subscribe({
        next: () => {
          this.snackBarService.showSuccess('Sala atualizada com sucesso');
          this.carregarEspacos();
        },
      });
    }
  }
}
