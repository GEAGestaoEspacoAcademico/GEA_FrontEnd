import type { OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { DisciplinaService } from '../../../services/disciplina/disciplina.service';
import { SalaService } from '../../../services/sala/sala.service';
import { JanelasHorarioService } from '../../../services/janelas-horario/janelas-horario.service';
import { AgendamentoService } from '../../../services/agendamento/agendamento.service';
import { IconRegistryService } from '../../../services/iconService/icon-registry';
import { PushNotificationService } from '../../../services/push-notification/push-notification.service';
import type { Disciplina } from '../../../models/disciplina.model';
import type { Sala } from '../../../models/sala.model';
import type { JanelaHorario } from '../../../models/janelasHorario.model';

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
    this.janelaHorarioService.getJanelasHorario().subscribe(res => {this.horariosDisponiveis = res});
  }

  getDiaSemana(dia: string){
    this.diaSemana = dia;
  }

  // Ação: Usuário selecionou datas no componente filho
  onDaysSelected(dates: Date[]) {
    this.selectedRecurringDates = dates;

    // if (dates.length > 0) {
    //   this.buscarHorarios();
    // } else {
    //   this.horariosDisponiveis = [];
    //   this.statusMessage.set('Selecione datas para ver horários.');
    //   this.statusClass.set('bg-blue-50 text-blue-900 border-blue-200');
    // }
  }

// buscarHorarios() {
//     const listaDatas = this.selectedRecurringDates.map(d => d.toISOString().split('T')[0]);
//     const payload: Datas = {
//       datas: listaDatas
//     };

//     this.janelaHorarioService.postJanelasHorarioPorDatas(payload).subscribe({
//       next: (res) => {
//         this.horariosDisponiveis = res;
//         this.isLoadingHorarios = false;
//       },
//       error: () => {
//         this.isLoadingHorarios = false;
//         this.statusMessage.set('Erro ao buscar horários.');
//         this.statusType.set('danger');
//       }
//     });
//   }


  // postAulaRecorrencia() {
  //   let recorrenciaBody = {

  //   }
  // }
}
