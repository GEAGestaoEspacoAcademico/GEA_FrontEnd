import { Component, inject } from '@angular/core';
import { IconRegistryService } from './services/iconService/icon-registry';
import { PushNotificationService } from './services/push-notification/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
})
export class App {
  dataEscolhida: Date | null = null;     // Para AULA
  datasSelecionadas: Date[] = [];        // Para EVENTO

  onDatasSelecionadas(dates: Date[]) {
    this.datasSelecionadas = dates;

    // 💡 Lógica para acionar a busca de horários no componente filho
    if (dates && dates.length > 0) {
      // Se houver pelo menos uma data, use a primeira data selecionada
      // para acionar o setter [singleDate] no SmartSchedulingForm.
      this.dataEscolhida = dates[0];
    } else {
      // Se a seleção for limpa, zere o valor para resetar o formulário filho.
      this.dataEscolhida = null;
    }
  }

  // Quando o form enviar aula
  agendarAula(payload: any) {
    console.log("📨 Aula enviada:", payload);
    console.log("📅 Data escolhida:", this.dataEscolhida);
  }

  // // Quando o form enviar batch (evento)
  agendarEvento(payload: any[]) {
    console.log("📦 Evento batch enviado:", payload);
    console.log("📅 Datas:", this.datasSelecionadas);
  }

  private iconRegistryService = inject(IconRegistryService);
  private pushNotificationService = inject(PushNotificationService);

  constructor() {
    this.iconRegistryService.registerIcons();
    this.pushNotificationService.listenToMessages();
    this.pushNotificationService.listenToNotificationClicks();

    this.pushNotificationService.inscreverNotificacao();
  }
}
