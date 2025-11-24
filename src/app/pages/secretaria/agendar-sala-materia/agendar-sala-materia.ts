import type { OnInit } from '@angular/core';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { DisciplinaService } from '../../../services/disciplina/disciplina.service';
import { SalaService } from '../../../services/sala/sala.service';
import { JanelasHorarioService } from '../../../services/janelas-horario/janelas-horario.service';
import { AgendamentoService } from '../../../services/agendamento/agendamento.service';
import { IconRegistryService } from '../../../services/iconService/icon-registry';
import { PushNotificationService } from '../../../services/push-notification/push-notification.service';
import type { Disciplina } from '../../../models/disciplina.model';
import type { Sala } from '../../../models/sala.model';
import type { Datas, JanelaHorario } from '../../../models/janelasHorario.model';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../../store/auth/auth.selectors';
import { filter, finalize, switchMap, take } from 'rxjs';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import type { MultiDateSelector } from '../../../components/shared/multi-date-selector/multi-date-selector';
import type { RecurringSchedulingForm } from '../../../components/shared/recurring-scheduling-form/recurring-scheduling-form';

@Component({
  selector: 'app-agendar-sala-materia',
  standalone: false,
  templateUrl: './agendar-sala-materia.html',
  styleUrl: './agendar-sala-materia.css'
})
export class AgendarSalaMateria implements OnInit {
  private disciplinaService = inject(DisciplinaService);
  private salaService = inject(SalaService);
  private janelaHorarioService = inject(JanelasHorarioService);
  private agendamentoService = inject(AgendamentoService);
  private iconRegistryService = inject(IconRegistryService);
  private pushNotificationService = inject(PushNotificationService);
  private store = inject(Store);
  private snackbarService = inject(SnackBarService);

  @ViewChild('calendario') calendario!: MultiDateSelector;
  @ViewChild('formulario') formulario!: RecurringSchedulingForm;

  // Estado de Dados (Variáveis simples para o template)
  disciplinas: Disciplina[] = [];
  locais: Sala[] = [];
  horariosDisponiveis: JanelaHorario[] = [];
  selectedRecurringDates: Date[] = [];

  // Estado de UI
  isLoadingHorarios = false;
  isSaving = false;
  statusMessage = signal('Bem-vindo. Selecione datas no calendário.');
  statusClass = signal('bg-blue-50 text-blue-900 border-blue-200');
  diaSemana: string = "";

  constructor() {
    this.iconRegistryService.registerIcons();
    this.pushNotificationService.listenToMessages();
    this.pushNotificationService.listenToNotificationClicks();
    this.pushNotificationService.inscreverNotificacao();
  }

  ngOnInit() {
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais() {
    this.disciplinaService.getDisciplinas().subscribe(res => {this.disciplinas = res;});
    this.salaService.getSalas().subscribe(res => {this.locais = res;});
  }

  getDiaSemana(dia: string){
    this.diaSemana = dia;
  }

  onDaysSelected(dates: Date[]) {
    this.selectedRecurringDates = dates;

    if (dates.length > 0) {
      this.buscarHorarios();
    } else {
      this.horariosDisponiveis = [];
      this.statusMessage.set('Selecione datas para ver horários.');
      this.statusClass.set('bg-blue-50 text-blue-900 border-blue-200');
    }
  }

buscarHorarios() {
    const listaDatas = this.selectedRecurringDates.map(d => d.toISOString().split('T')[0]);
    const payload: Datas = {
      datas: listaDatas
    };

    this.janelaHorarioService.postJanelasHorarioPorDatas(payload).subscribe({
      next: (res: JanelaHorario[]) => {
        this.horariosDisponiveis = res;
        this.isLoadingHorarios = false;
      },
      error: () => {
        this.isLoadingHorarios = false;
        this.statusMessage.set('Erro ao buscar horários.');
      }
    });
  }

    resetScreen() {
    this.selectedRecurringDates = [];
    this.horariosDisponiveis = [];
    this.diaSemana = '';
  }


 postDataRecorrente(formData: any) { 
    this.isSaving = true;

    const janelasIds = this.horariosDisponiveis
      .filter((_, i) => formData.horarios[i])
      .map(h => h.janelasHorarioId);

    const datasOrdenadas = [...this.selectedRecurringDates].sort((a, b) => a.getTime() - b.getTime());

    const dataInicio = datasOrdenadas[0].toISOString().split('T')[0];
    const dataFim = datasOrdenadas[datasOrdenadas.length - 1].toISOString().split('T')[0];

    this.store.select(selectUserId).pipe(
      filter((userId: any): userId is number => !!userId),
      take(1),
      switchMap((userId) => {
        const recorrenciaBody = {
          usuarioId: userId,
          dataInicio: dataInicio,
          dataFim: dataFim,
          diaDaSemana: this.diaSemana,
          janelasHorarioId: janelasIds,
          disciplinaId: formData.disciplina,
          salaId: formData.local
        };

        return this.agendamentoService.criarAgendamentoAulaRecorrente(recorrenciaBody);
      }),finalize(() => {
        this.resetScreen(); 
      })
    ).subscribe({
      next: () => {
        this.snackbarService.showSuccess('Agendamento realizado com Sucesso!');
      },
      error: (err) => {
        this.snackbarService.showError('Falha ao realizar agendamento.');
      }
    });
  }
}
