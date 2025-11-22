import { Component, inject, output, signal } from '@angular/core';
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
export class AgendarSalaMateria {
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
    this.disciplinaService.getDisciplinas().subscribe(res => {this.disciplinas = res; console.log(this.disciplinas);});
    this.salaService.getSalas().subscribe(res => {this.locais = res; console.log(this.disciplinas);});
    this.janelaHorarioService.getJanelasHorario().subscribe(res => {this.horariosDisponiveis = res});
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

  // Ação: Buscar horários na API
  // buscarHorarios() {
  //   this.isLoadingHorarios = true;
  //   this.statusMessage.set('Verificando disponibilidade...');
  //   this.statusClass.set('bg-yellow-50 text-yellow-900 border-yellow-200');

  //   const datesParam = this.selectedRecurringDates.toString(); // Formato para API

  //   this.janelaHorarioService.getJanelaHorarioPorData(datesParam).subscribe({
  //     next: (res) => {
  //       this.horariosDisponiveis = res;
  //       this.isLoadingHorarios = false;
        
  //       if (res.length > 0) {
  //         this.statusMessage.set(`${res.length} horários encontrados.`);
  //         this.statusClass.set('bg-green-50 text-green-900 border-green-200');
  //       } else {
  //         this.statusMessage.set('Nenhum horário disponível para estas datas.');
  //         this.statusClass.set('bg-red-50 text-red-900 border-red-200');
  //       }
  //     },
  //     error: () => {
  //       this.isLoadingHorarios = false;
  //       this.statusMessage.set('Erro ao buscar horários.');
  //       this.statusClass.set('bg-red-50 text-red-900 border-red-200');
  //     }
  //   });
  // }

  // Ação: Usuário preencheu tudo e clicou em Agendar
  // onSchedule(formData: SchedulingFormValue) {
  //   this.isSaving = true;

  //   const horariosReais = this.horariosDisponiveis.filter((_, i) => formData.horarios[i]);
    
  //   const payload = {
  //     datas: this.selectedRecurringDates,
  //     disciplinaId: formData.disciplina,
  //     localId: formData.local,
  //     horarios: horariosReais
  //   };

  //   this.agendamentoService(payload).subscribe({
  //     next: () => {
  //       this.isSaving = false;
  //       this.statusMessage.set('Agendamento realizado com Sucesso!');
  //       this.statusClass.set('bg-green-100 text-green-900 border-green-400 font-bold');
  //     },
  //     error: () => {
  //       this.isSaving = false;
  //       this.statusMessage.set('Falha ao realizar agendamento.');
  //       this.statusClass.set('bg-red-100 text-red-900 border-red-400');
  //     }
  //   });
  // }
}
