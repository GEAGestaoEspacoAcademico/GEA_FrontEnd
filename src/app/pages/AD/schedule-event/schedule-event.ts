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
  
  ngOnInit(): void {
    this.headerService.setTitle('Agendar Evento')
    this.headerService.showBack()
  }
  
  pegarDias(dias: Date[]){
    this.datasSelecionadas = dias
  }

  salvarAgendamentos(eventos: CriarEventoFormulario[]){
    console.log("[AGENDAR EVENTO] data: ", eventos)
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
        console.log('Todos os eventos foram criados:', respostas);
        this.isLoadingCriarEvento = false;
        this.snackBarService.showSuccess(`${respostas.length} eventos criados com sucesso!`);
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
