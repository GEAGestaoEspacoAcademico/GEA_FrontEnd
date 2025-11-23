import { Component, inject, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, switchMap, throwError } from 'rxjs';
import type { ScheduleDayModal } from '../../../components/shared/schedule-day-modal/schedule-day-modal';
import { AgendamentoService } from '../../../services/agendamento/agendamento.service';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { selectUserId } from '../../../store/auth/auth.selectors';
import type { AgendamentoAulaCriarADRequest } from '../../../types/agendamentoAula.type';
import type { CriarAgendamentoAulaFormulario } from '../../../types/util.types';
import { FormatUtils } from '../../../utils/format.utils';

@Component({
  selector: 'app-schedule-class',
  standalone: false,
  templateUrl: './schedule-class.html',
  styleUrl: './schedule-class.css'
})
export class ScheduleClass {
  data: Date = new Date();
  isLoadingCriarAula = false;
  private agendamentoService = inject(AgendamentoService)
  private snackBarService = inject(SnackBarService)
  private store = inject(Store)

  usuarioId$ = this.store.select(selectUserId)


  @ViewChild("scheduleModal") scheduleModal!: ScheduleDayModal;
  

  pegarDias(dias: Date[]){
    this.data = dias[0]
  }

  salvarAgendamentoAula(aula: CriarAgendamentoAulaFormulario){
    console.log("[AGENDAR Aula] data: ", aula)
    this.isLoadingCriarAula = true;

    if(!aula) {return;}
    this.usuarioId$.pipe(
      take(1),
      switchMap((usuarioId) => {
        if(!usuarioId) {
          return throwError(() => new Error("Não foi possível identificar o usuário logado."))
        }

        const corpoRequisicao: AgendamentoAulaCriarADRequest = {
          data: FormatUtils.formatDateForInput(aula.date),
          disciplinaId: aula.disciplina,
          horaFim: aula.fim,
          horaInicio: aula.inicio,
          salaId: aula.local,
          solicitante: aula.solicitante,
          usuarioId: usuarioId
        }
        return this.agendamentoService.criarAgendamentoAulaAD(corpoRequisicao)
      })
    ).subscribe({
      next: (_) => {
        this.snackBarService.showSuccess("Agendamento aula criado com sucesso")
        this.isLoadingCriarAula = false
      },
      error: () => {
        this.snackBarService.showError("Erro ao criar agendamento aula")
        this.isLoadingCriarAula = false
      }
    })
  }


  abirModalDetalhe(data: Date){
    this.scheduleModal.abrirModal(data);
  }
}
