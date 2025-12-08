import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
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
import { filter, switchMap, take } from 'rxjs';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import type { MultiDateSelector } from '../../../components/shared/multi-date-selector/multi-date-selector';
import type { RecurringSchedulingForm } from '../../../components/shared/recurring-scheduling-form/recurring-scheduling-form';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import type { ConfirmationModal } from '../../../components/modals/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-agendar-sala-materia',
  standalone: false,
  templateUrl: './agendar-sala-materia.html',
  styleUrl: './agendar-sala-materia.css',
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
  private headerService = inject(HeaderTitleService);

  @ViewChild('calendario') calendario!: MultiDateSelector;
  @ViewChild('formulario') formulario!: RecurringSchedulingForm;
  @ViewChild('meuModalAviso') modalAviso!: ConfirmationModal;

  disciplinas: Disciplina[] = [];
  locais: Sala[] = [];
  horariosDisponiveis: JanelaHorario[] = [];
  selectedRecurringDates: Date[] = [];

  isLoadingHorarios = false;
  isSaving = false;
  diaSemana: string = '';
  currentSalaId: number | null = null;
  formularioEvento: any;

  constructor() {
    this.iconRegistryService.registerIcons();
    this.pushNotificationService.listenToMessages();
    this.pushNotificationService.listenToNotificationClicks();
    this.pushNotificationService.inscreverNotificacao();
  }

  ngOnInit() {
    this.carregarDadosIniciais();
    this.headerService.setTitle('Agendar Sala da Matéria');
    this.headerService.showBack();
  }

  carregarDadosIniciais() {
    this.disciplinaService.getDisciplinas().subscribe((res) => {
      this.disciplinas = res;
    });
    this.salaService.getSalas().subscribe((res) => {
      this.locais = res;
    });
  }

  getDiaSemana(dia: string) {
    this.diaSemana = dia;
  }

  onSalaIdChange(id: number | null) {
    this.currentSalaId = id;
    if (this.selectedRecurringDates.length > 0) {
      this.buscarHorarios();
    }
  }

  onDaysSelected(dates: Date[]) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    this.selectedRecurringDates = dates.filter(d => {
      return d && d >= hoje;
    });
    
    if (dates.length > 0 && this.currentSalaId) {
      this.buscarHorarios();
    } else {
      this.horariosDisponiveis = [];
    }
  }

  buscarHorarios() {
    const listaDatas = this.selectedRecurringDates.map((d) => d.toISOString().split('T')[0]);

    const payload: Datas = {
      datas: listaDatas,
      salaId: this.currentSalaId,
    };

    this.janelaHorarioService.postJanelasHorarioPorDatas(payload).subscribe({
      next: (res: JanelaHorario[]) => {
        this.horariosDisponiveis = res;
        this.isLoadingHorarios = false;
      },
      error: (err) => {
        this.isLoadingHorarios = false;
        this.snackbarService.showError(err);
      },
    });
  }

  resetScreen() {
    this.selectedRecurringDates = [];
    this.horariosDisponiveis = [];
    this.diaSemana = '';
  }

  postDataRecorrente(formData: any) {
    const janelasIds = this.horariosDisponiveis
      .filter((_, i) => formData.horarios[i])
      .map((h) => h.janelasHorarioId);

    const dataInicioRaw = formData.dataInicio;
    const dataFimRaw = formData.dataFim;

    const dataInicio = new Date(dataInicioRaw).toISOString().split('T')[0];
    const dataFim = new Date(dataFimRaw).toISOString().split('T')[0];

    this.store
      .select(selectUserId)
      .pipe(
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
            salaId: formData.local,
          };
          return this.agendamentoService.criarAgendamentoAulaRecorrente(recorrenciaBody);
        }),
      )
      .subscribe({
        next: () => {
          this.snackbarService.showSuccess('Agendamento realizado com Sucesso!');

          setTimeout(() => {
            window.location.reload();
            sessionStorage.clear();
          }, 1000);
        },
        error: (err) => {
          this.snackbarService.showError(err);
        },
      });
  }

  confimarAgendamento(form: any) {
    if (form) {
      this.formularioEvento = form;
      this.modalAviso.open();
    } else {
      this.snackbarService.showError('Formulário recebido inválido.');
    }
  }

  fazerAcao(): void {
    if (this.formularioEvento) {
      this.postDataRecorrente(this.formularioEvento);
    } else {
      this.snackbarService.showError('Dados do formulário não encontrados. Tente novamente.');
    }
  }
}
