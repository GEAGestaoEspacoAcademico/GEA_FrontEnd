import type { OnInit} from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import type { ScheduleDayModal } from '../../../components/shared/schedule-day-modal/schedule-day-modal';
import type { CriarEventoFormulario } from '../../../types/agendamentoEvento.type';
import { AgendamentoService } from '../../../services/agendamento/agendamento.service';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../../store/auth/auth.selectors';
import { forkJoin, switchMap, take, throwError } from 'rxjs';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import { MultiDateSelector } from '../../../components/shared/multi-date-selector/multi-date-selector';

@Component({
  selector: 'app-schedule-event',
  standalone: false,
  templateUrl: './schedule-event.html',
  styleUrl: './schedule-event.css'
})
export class ScheduleEvent implements OnInit{
  datasSelecionadas: Date[] = [new Date()];
  isLoadingCriarEvento = false;
  private agendamentoService = inject(AgendamentoService)
  private snackBarService = inject(SnackBarService)
  private store = inject(Store)
  private headerService = inject(HeaderTitleService);
  
  usuarioId$ = this.store.select(selectUserId)
  
  
  @ViewChild("scheduleModal") scheduleModal!: ScheduleDayModal;
  @ViewChild(MultiDateSelector) dateSelector!: MultiDateSelector;
  
  ngOnInit(): void {
    this.headerService.setTitle('Agendar Evento')
    this.headerService.showBack()
  }
  
  pegarDias(dias: Date[]){
    this.datasSelecionadas = dias
  }

  salvarAgendamentos(eventos: CriarEventoFormulario[]){
    this.isLoadingCriarEvento = true;
    if(!eventos) {return;}
    this.usuarioId$.pipe(
      take(1), 
      switchMap((usuarioId) => {
      if (!usuarioId) {
        return throwError(() => new Error("Não foi possível identificar o usuário logado."));
    }
        const listaDeRequisicoes = eventos.map(evento => {
          
          const payloadCompleto = { 
            ...evento, 
            usuarioId: usuarioId 
          };
          return this.agendamentoService.criarAgendamentoEvento(payloadCompleto);
        });
        return forkJoin(listaDeRequisicoes);
      })
    ).subscribe({
      next: (respostas) => {
        this.isLoadingCriarEvento = false;
        this.snackBarService.showSuccess(`${respostas.length} evento criado com sucesso!`);
        this.datasSelecionadas = [];
        if (this.dateSelector) {
          this.dateSelector.limparSelecao();
        }
      },
      error: (erro) => {
        console.error('Erro ao salvar lote:', erro);
        this.isLoadingCriarEvento = false;
        this.snackBarService.showError("Erro ao criar alguns eventos. Tente novamente.");
    }})
  }


  abirModalDetalhe(data: Date){
    this.scheduleModal.abrirModal(data);
  }

}
