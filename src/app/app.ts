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

  // MÚLTIPLAS DATAS
  onDatasSelecionadas(dates: Date[]) {
    this.datasSelecionadas = dates;
  }

  // DATA ÚNICA (double click)
  onDataUnicaSelecionada(date: Date) {
    this.dataEscolhida = date;
    console.log("📅 dataEscolhida (aula):", this.dataEscolhida);
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
