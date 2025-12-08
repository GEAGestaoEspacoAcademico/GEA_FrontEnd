import { ChangeDetectorRef, Component, inject, type OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, switchMap, take, type Observable } from 'rxjs';
import { AgendamentoService } from '../../../services/agendamento/agendamento.service';
import type { Agendamento } from '../../../models/agendamento.model';
import type { ConfirmationModal } from '../../../components/modals/confirmation-modal/confirmation-modal';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import { selectUserId } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-agendamentos',
  standalone: false,
  templateUrl: './agendamentos.html',
  styleUrl: './agendamentos.css',
})
export class Agendamentos implements OnInit {
  dataAtual: Date | string = '';
  listaAgendamentos: Agendamento[] = [];

  private store = inject(Store);
  agendamentoService = inject(AgendamentoService);
  router = inject(Router);
  snackbarService = inject(SnackBarService);
  headerService = inject(HeaderTitleService);

  usuarioId$: Observable<number | undefined> = this.store.select(selectUserId);

  @ViewChild('meuModalAviso') modalAviso!: ConfirmationModal;

  idAgendamento?: number;

  private readonly cdr = inject(ChangeDetectorRef);

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
        if (response) {
          this.listaAgendamentos = response;
        } else {
          this.listaAgendamentos = [];
        }
      },
      error: (err) => {
        console.log(err);
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
    if (this.idAgendamento) {
      this.usuarioId$
        .pipe(
          filter((id) => !!id),
          take(1),
          switchMap((usuarioId) => {
            return this.agendamentoService.cancelarAgendamentoAula(
              this.idAgendamento!,
              usuarioId!,
            );
          }),
        )
        .subscribe({
          next: () => {
            this.snackbarService.showSuccess('Agendamento cancelado com sucesso!');
            this.buscarAgendamentos(new Date(this.dataAtual));
            this.idAgendamento = undefined;
          },
          error: (err) => {
            this.snackbarService.showError('Não foi possível cancelar agendamento!');
            console.log(err);
            this.idAgendamento = undefined;
          },
        });
    }
  }

  navegarParaNovoRecorrente(): void {
    this.router.navigate(['/ad/agendar-aula']);
  }
}
