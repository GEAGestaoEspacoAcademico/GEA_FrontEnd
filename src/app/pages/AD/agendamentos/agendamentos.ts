import { ChangeDetectorRef, Component, inject, type OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgendamentoService } from '../../../services/agendamento/agendamento.service';
import type { Agendamento } from '../../../models/agendamento.model';
import type { ConfirmationModal } from '../../../components/modals/confirmation-modal/confirmation-modal';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';

@Component({
  selector: 'app-agendamentos',
  standalone: false,
  templateUrl: './agendamentos.html',
  styleUrl: './agendamentos.css',
})
export class Agendamentos implements OnInit {
  dataAtual: string | Date = '';
  listaAgendamentos: Agendamento[] = [];

  agendamentoService = inject(AgendamentoService);
  router = inject(Router);
  snackbarService = inject(SnackBarService);
  headerService = inject(HeaderTitleService);

  @ViewChild('meuModalAviso') modalAviso!: ConfirmationModal;

  idAgendamento?: number;

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.headerService.setTitle('Agendamentos');
    this.headerService.showBack();
  }

  selecaoChange(novaData: Date[]): void {
    if (novaData.length > 0) {
      const dataParaBuscar: Date = novaData[0];
      this.dataAtual = dataParaBuscar;
      this.buscarAgendamentos(dataParaBuscar);
    } else {
      this.listaAgendamentos = [];
      this.cdr.detectChanges();
    }
  }

  buscarAgendamentos(data: Date): void {
    const dataFormatada = data.toISOString().split('T')[0];

    this.agendamentoService.getAgendamentoPorData(dataFormatada).subscribe({
      next: (response) => {
        this.listaAgendamentos = response;
      },
      error: (err) => {
        this.snackbarService.showError(err);
        this.listaAgendamentos = [];
      },
    });
  }

  handleExclusao(id: number): void {
    this.modalAviso.open();

    this.idAgendamento = id;
  }

  handleEdicao(id: number): void {
    console.log('Id do agendamento a ser editado: ' + id);
  }

  fazerAcao() {
    this.agendamentoService.deleteAgendamentoAula(this.idAgendamento!).subscribe({
      next: () => {
        this.snackbarService.showSuccess('Agendamento excluido com sucesso!');

        setTimeout(() => {
          window.location.reload();
          sessionStorage.clear();
        }, 1000);
      },
      error: (err) => {
        this.snackbarService.showError(err);
        this.idAgendamento = undefined;
      },
    });
  }

  navegarParaNovoRecorrente(): void {
    this.router.navigate(['/ad/agendar-aula']);
  }
}
