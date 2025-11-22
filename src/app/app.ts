import { Component, computed, effect, inject, signal } from '@angular/core';
import { IconRegistryService } from './services/iconService/icon-registry';
import { PushNotificationService } from './services/push-notification/push-notification.service';
import { DisciplinaService } from './services/disciplina/disciplina.service';
import { SalaService } from './services/sala/sala.service';
import { JanelasHorarioService } from './services/janelas-horario/janelas-horario.service';
import { AgendamentoService } from './services/agendamento/agendamento.service';
import type { Disciplina } from './models/disciplina.model';
import type { Sala } from './models/agendamento.model';
import type { JanelaHorario } from './models/janelasHorario.model';
import type { RecurringSchedulingForm } from './components/shared/recurring-scheduling-form/recurring-scheduling-form';
import type { SchedulingFormValue } from './pages/secretaria/agendar-sala-materia/test';
import { MockDataService } from './pages/secretaria/agendar-sala-materia/test';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
})
export class App {
private disciplinaService = inject(DisciplinaService);
  private salaService = inject(SalaService);
  private janelaHorarioService = inject(JanelasHorarioService);
  private agendamentoService = inject(AgendamentoService);
  private iconRegistryService = inject(IconRegistryService);
  private pushNotificationService = inject(PushNotificationService);

  // -- VARIÁVEIS NORMAIS (Não são mais Signals) --
  disciplinas: Disciplina[] = [];
  locais: Sala[] = [];
  horariosDisponiveis: JanelaHorario[] = [];
  selectedRecurringDates: Date[] = [];
  
  isLoadingHorarios: boolean = false;
  
  // -- Signals apenas para UI status --
  statusMessage = signal('Aguardando dados...');
  statusClass = signal('bg-blue-50 text-blue-800');

  constructor() {
    this.iconRegistryService.registerIcons();
    this.pushNotificationService.listenToMessages();
    this.pushNotificationService.listenToNotificationClicks();
    this.pushNotificationService.inscreverNotificacao();
  }

  ngOnInit(): void {
    this.getDisciplinas();
    this.getSalas();
  }

  getDisciplinas(){
    this.disciplinaService.getDisciplinas().subscribe({
      next: (disciplinas) => {
        this.disciplinas = disciplinas; 
      }
    });
  }

  getSalas(){
    this.salaService.getSalas().subscribe({
      next: (salas) => {
        this.locais = salas;
      }
    });
  }

  // IMPLEMENTAÇÃO SOLICITADA
  getHorarios(){
    this.isLoadingHorarios = true;
    this.statusMessage.set('Buscando horários...');
    
    // toString() em array de datas retorna "DateString,DateString..."
    this.janelaHorarioService.getJanelaHorarioPorData(this.selectedRecurringDates.toString()).subscribe({
      next: (horas) => {
        this.horariosDisponiveis = horas;
        this.isLoadingHorarios = false;
        
        if (horas.length > 0) {
          this.statusMessage.set('Horários atualizados.');
        } else {
          this.statusMessage.set('Sem horários disponíveis.');
        }
      },
      error: (err) => {
        this.isLoadingHorarios = false;
        this.statusMessage.set('Erro ao buscar horários.');
      }
    });
  }

  onDaysSelected(dates: Date[]) {
    // Atualiza a variável normal
    this.selectedRecurringDates = dates;
    
    // Chama o método se houver datas
    if (this.selectedRecurringDates.length > 0) {
      this.getHorarios();
    } else {
      this.horariosDisponiveis = [];
      this.statusMessage.set('Selecione datas.');
    }
  }

  onSchedule(data: any) {
    console.log('Agendar:', data);
  }
}
