import { Component, inject } from '@angular/core';
import { IconRegistryService } from './services/iconService/icon-registry';
import { PushNotificationService } from './services/push-notification/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
})
export class App {
  datasSelecionadas: Date[] = [
    new Date()
  ];

  dataEscolhida: Date = new Date();

  agendarAula(event: any) {
    this.dataEscolhida = event.date;
    console.log("📅 dataEscolhida agora:", this.dataEscolhida);

    // Aqui você enviaria para API
  }

  enviarEventos(event: any[]) {
    console.log('Batch recebido (eventos):', event);

    // Aqui você enviaria API
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
